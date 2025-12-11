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
"[project]/Videos/foodapp/app/api/solvers/assignment/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Videos$2f$foodapp$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Videos/foodapp/node_modules/next/server.js [app-route] (ecmascript)");
;
function hungarianAlgorithm(costMatrix) {
    const n = costMatrix.length;
    const m = costMatrix[0]?.length || n;
    // Pad to square matrix if needed
    const maxDim = Math.max(n, m);
    const matrix = Array(maxDim).fill(0).map((_, i)=>Array(maxDim).fill(0).map((_, j)=>i < n && j < m ? costMatrix[i][j] : Number.MAX_SAFE_INTEGER / 2));
    // Step 1: Subtract row minimums
    for(let i = 0; i < maxDim; i++){
        const minRow = Math.min(...matrix[i]);
        if (minRow !== Number.MAX_SAFE_INTEGER / 2) {
            for(let j = 0; j < maxDim; j++){
                if (matrix[i][j] !== Number.MAX_SAFE_INTEGER / 2) {
                    matrix[i][j] -= minRow;
                }
            }
        }
    }
    // Step 2: Subtract column minimums
    for(let j = 0; j < maxDim; j++){
        const minCol = Math.min(...matrix.map((row)=>row[j]));
        if (minCol !== Number.MAX_SAFE_INTEGER / 2) {
            for(let i = 0; i < maxDim; i++){
                if (matrix[i][j] !== Number.MAX_SAFE_INTEGER / 2) {
                    matrix[i][j] -= minCol;
                }
            }
        }
    }
    // Step 3: Greedy assignment on reduced matrix
    const assignment = Array(maxDim).fill(0).map(()=>Array(maxDim).fill(0));
    const usedRows = new Set();
    const usedCols = new Set();
    for(let i = 0; i < maxDim; i++){
        for(let j = 0; j < maxDim; j++){
            if (matrix[i][j] === 0 && !usedRows.has(i) && !usedCols.has(j)) {
                assignment[i][j] = 1;
                usedRows.add(i);
                usedCols.add(j);
                break;
            }
        }
    }
    // Step 4: Calculate total cost from original matrix
    let totalCost = 0;
    for(let i = 0; i < n; i++){
        for(let j = 0; j < m; j++){
            if (assignment[i][j] === 1) {
                totalCost += costMatrix[i][j];
            }
        }
    }
    return {
        assignment,
        totalCost
    };
}
async function POST(request) {
    try {
        const body = await request.json();
        const { num_riders, num_orders, cost_matrix } = body;
        const { assignment, totalCost } = hungarianAlgorithm(cost_matrix);
        const assignments = [];
        for(let i = 0; i < num_riders; i++){
            for(let j = 0; j < num_orders; j++){
                if (assignment[i][j] === 1) {
                    assignments.push({
                        ambulance: i + 1,
                        emergency: j + 1,
                        cost: cost_matrix[i][j]
                    });
                }
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Videos$2f$foodapp$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            status: "Optimal",
            total_cost: totalCost,
            assignments: assignments,
            is_balanced: num_riders === num_orders
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Videos$2f$foodapp$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            status: "Error",
            error_message: String(error),
            total_cost: null,
            assignments: null
        }, {
            status: 400
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__360dbbae._.js.map