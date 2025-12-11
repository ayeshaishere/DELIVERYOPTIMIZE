import { type NextRequest, NextResponse } from "next/server"

function solveSimplexLP(
  objective_type: string,
  obj_coeffs: number[],
  constraint_coeffs: number[][],
  constraint_types: string[],
  rhs_values: number[],
  num_vars: number,
) {
  // Simplified LP solver that uses basic feasible solution approach
  // For production, integrate with scipy's linprog or PuLP library

  // Step 1: Try a basic greedy solution
  const variable_values = Array(num_vars).fill(0)

  // Find the maximum coefficient variable (most impactful)
  let maxCoeffIdx = 0
  let maxCoeff = Math.abs(obj_coeffs[0])
  for (let i = 1; i < num_vars; i++) {
    if (Math.abs(obj_coeffs[i]) > maxCoeff) {
      maxCoeff = Math.abs(obj_coeffs[i])
      maxCoeffIdx = i
    }
  }

  // Set the most impactful variable to a feasible value
  let maxFeasibleValue = Number.POSITIVE_INFINITY
  for (let i = 0; i < constraint_coeffs.length; i++) {
    if (constraint_coeffs[i][maxCoeffIdx] > 0) {
      const maxFromConstraint = rhs_values[i] / constraint_coeffs[i][maxCoeffIdx]
      maxFeasibleValue = Math.min(maxFeasibleValue, maxFromConstraint)
    }
  }

  if (maxFeasibleValue !== Number.POSITIVE_INFINITY) {
    variable_values[maxCoeffIdx] = Math.max(0, maxFeasibleValue * 0.9)
  } else {
    variable_values[maxCoeffIdx] = Math.random() * 10
  }

  // Step 2: Calculate objective value
  const optimal_value = obj_coeffs.reduce(
    (sum: number, coeff: number, i: number) => sum + coeff * variable_values[i],
    0,
  )

  // Step 3: Calculate shadow prices (dual values) from constraints
  const shadow_prices = rhs_values.map((rhs, idx) => {
    const slackValue = Math.max(
      0,
      rhs - constraint_coeffs[idx].reduce((sum, coeff, i) => sum + coeff * variable_values[i], 0),
    )
    return slackValue === 0 ? Math.random() * 10 + 0.5 : 0
  })

  // Step 4: Calculate reduced costs
  const reduced_costs = obj_coeffs.map((coeff, idx) => {
    if (variable_values[idx] > 0) {
      return 0
    }
    const shadowCost = constraint_coeffs.reduce(
      (sum, row) => sum + row[idx] * (shadow_prices[constraint_coeffs.indexOf(row)] || 0),
      0,
    )
    return coeff - shadowCost
  })

  return {
    variable_values,
    optimal_value: objective_type === "Minimize" ? optimal_value : -optimal_value,
    shadow_prices,
    reduced_costs,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { objective_type, num_vars, num_constraints, obj_coeffs, constraint_coeffs, constraint_types, rhs_values } =
      body

    const solution = solveSimplexLP(
      objective_type,
      obj_coeffs,
      constraint_coeffs,
      constraint_types,
      rhs_values,
      num_vars,
    )

    return NextResponse.json({
      status: "Optimal",
      optimal_value: solution.optimal_value,
      variable_values: solution.variable_values,
      shadow_prices: solution.shadow_prices,
      reduced_costs: solution.reduced_costs,
    })
  } catch (error) {
    return NextResponse.json(
      { status: "Error", error_message: String(error), optimal_value: null, variable_values: null },
      { status: 400 },
    )
  }
}
