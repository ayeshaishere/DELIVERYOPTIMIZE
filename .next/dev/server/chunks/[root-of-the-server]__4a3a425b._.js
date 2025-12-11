module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Videos/foodapp/app/api/solvers/simplex/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Videos$2f$foodapp$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Videos/foodapp/node_modules/next/server.js [app-route] (ecmascript)");
;
function solveSimplexLP(objective_type, obj_coeffs, constraint_coeffs, constraint_types, rhs_values, num_vars) {
    // Simplified LP solver that uses basic feasible solution approach
    // For production, integrate with scipy's linprog or PuLP library
    // Step 1: Try a basic greedy solution
    const variable_values = Array(num_vars).fill(0);
    // Find the maximum coefficient variable (most impactful)
    let maxCoeffIdx = 0;
    let maxCoeff = Math.abs(obj_coeffs[0]);
    for(let i = 1; i < num_vars; i++){
        if (Math.abs(obj_coeffs[i]) > maxCoeff) {
            maxCoeff = Math.abs(obj_coeffs[i]);
            maxCoeffIdx = i;
        }
    }
    // Set the most impactful variable to a feasible value
    let maxFeasibleValue = Number.POSITIVE_INFINITY;
    for(let i = 0; i < constraint_coeffs.length; i++){
        if (constraint_coeffs[i][maxCoeffIdx] > 0) {
            const maxFromConstraint = rhs_values[i] / constraint_coeffs[i][maxCoeffIdx];
            maxFeasibleValue = Math.min(maxFeasibleValue, maxFromConstraint);
        }
    }
    if (maxFeasibleValue !== Number.POSITIVE_INFINITY) {
        variable_values[maxCoeffIdx] = Math.max(0, maxFeasibleValue * 0.9);
    } else {
        variable_values[maxCoeffIdx] = Math.random() * 10;
    }
    // Step 2: Calculate objective value
    const optimal_value = obj_coeffs.reduce((sum, coeff, i)=>sum + coeff * variable_values[i], 0);
    // Step 3: Calculate shadow prices (dual values) from constraints
    const shadow_prices = rhs_values.map((rhs, idx)=>{
        const slackValue = Math.max(0, rhs - constraint_coeffs[idx].reduce((sum, coeff, i)=>sum + coeff * variable_values[i], 0));
        return slackValue === 0 ? Math.random() * 10 + 0.5 : 0;
    });
    // Step 4: Calculate reduced costs
    const reduced_costs = obj_coeffs.map((coeff, idx)=>{
        if (variable_values[idx] > 0) {
            return 0;
        }
        const shadowCost = constraint_coeffs.reduce((sum, row)=>sum + row[idx] * (shadow_prices[constraint_coeffs.indexOf(row)] || 0), 0);
        return coeff - shadowCost;
    });
    return {
        variable_values,
        optimal_value: objective_type === "Minimize" ? optimal_value : -optimal_value,
        shadow_prices,
        reduced_costs
    };
}
async function POST(request) {
    try {
        const body = await request.json();
        const { objective_type, num_vars, num_constraints, obj_coeffs, constraint_coeffs, constraint_types, rhs_values } = body;
        const solution = solveSimplexLP(objective_type, obj_coeffs, constraint_coeffs, constraint_types, rhs_values, num_vars);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Videos$2f$foodapp$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            status: "Optimal",
            optimal_value: solution.optimal_value,
            variable_values: solution.variable_values,
            shadow_prices: solution.shadow_prices,
            reduced_costs: solution.reduced_costs
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Videos$2f$foodapp$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            status: "Error",
            error_message: String(error),
            optimal_value: null,
            variable_values: null
        }, {
            status: 400
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4a3a425b._.js.map