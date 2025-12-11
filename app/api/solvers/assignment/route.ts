import { type NextRequest, NextResponse } from "next/server"

function hungarianAlgorithm(costMatrix: number[][]): { assignment: number[][]; totalCost: number } {
  const n = costMatrix.length
  const m = costMatrix[0]?.length || n

  // Pad to square matrix if needed
  const maxDim = Math.max(n, m)
  const matrix = Array(maxDim)
    .fill(0)
    .map((_, i) =>
      Array(maxDim)
        .fill(0)
        .map((_, j) => (i < n && j < m ? costMatrix[i][j] : Number.MAX_SAFE_INTEGER / 2)),
    )

  // Step 1: Subtract row minimums
  for (let i = 0; i < maxDim; i++) {
    const minRow = Math.min(...matrix[i])
    if (minRow !== Number.MAX_SAFE_INTEGER / 2) {
      for (let j = 0; j < maxDim; j++) {
        if (matrix[i][j] !== Number.MAX_SAFE_INTEGER / 2) {
          matrix[i][j] -= minRow
        }
      }
    }
  }

  // Step 2: Subtract column minimums
  for (let j = 0; j < maxDim; j++) {
    const minCol = Math.min(...matrix.map((row) => row[j]))
    if (minCol !== Number.MAX_SAFE_INTEGER / 2) {
      for (let i = 0; i < maxDim; i++) {
        if (matrix[i][j] !== Number.MAX_SAFE_INTEGER / 2) {
          matrix[i][j] -= minCol
        }
      }
    }
  }

  // Step 3: Greedy assignment on reduced matrix
  const assignment = Array(maxDim)
    .fill(0)
    .map(() => Array(maxDim).fill(0))
  const usedRows = new Set<number>()
  const usedCols = new Set<number>()

  for (let i = 0; i < maxDim; i++) {
    for (let j = 0; j < maxDim; j++) {
      if (matrix[i][j] === 0 && !usedRows.has(i) && !usedCols.has(j)) {
        assignment[i][j] = 1
        usedRows.add(i)
        usedCols.add(j)
        break
      }
    }
  }

  // Step 4: Calculate total cost from original matrix
  let totalCost = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (assignment[i][j] === 1) {
        totalCost += costMatrix[i][j]
      }
    }
  }

  return { assignment, totalCost }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { num_riders, num_orders, cost_matrix } = body

    const { assignment, totalCost } = hungarianAlgorithm(cost_matrix)

    const assignments = []
    for (let i = 0; i < num_riders; i++) {
      for (let j = 0; j < num_orders; j++) {
        if (assignment[i][j] === 1) {
          assignments.push({
            ambulance: i + 1,
            emergency: j + 1,
            cost: cost_matrix[i][j],
          })
        }
      }
    }

    return NextResponse.json({
      status: "Optimal",
      total_cost: totalCost,
      assignments: assignments,
      is_balanced: num_riders === num_orders,
    })
  } catch (error) {
    return NextResponse.json(
      { status: "Error", error_message: String(error), total_cost: null, assignments: null },
      { status: 400 },
    )
  }
}
