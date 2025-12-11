import { type NextRequest, NextResponse } from "next/server"

function vogelsApproximationMethod(
  costMatrix: number[][],
  supply: number[],
  demand: number[],
): { allocation: number[][]; totalCost: number } {
  const m = supply.length
  const n = demand.length
  const allocation = Array(m)
    .fill(0)
    .map(() => Array(n).fill(0))

  const supplyLeft = [...supply]
  const demandLeft = [...demand]
  const usedCells = new Set<string>()

  // VAM implementation
  let iteration = 0
  while (supplyLeft.some((s) => s > 0) && demandLeft.some((d) => d > 0) && iteration < 1000) {
    iteration++

    // Calculate penalties for each row and column
    const rowPenalties: number[] = []
    for (let i = 0; i < m; i++) {
      if (supplyLeft[i] > 0) {
        const costs = costMatrix[i]
          .map((c, j) => (demandLeft[j] > 0 ? c : Number.MAX_SAFE_INTEGER))
          .filter((c) => c !== Number.MAX_SAFE_INTEGER)
        if (costs.length >= 2) {
          costs.sort((a, b) => a - b)
          rowPenalties.push(costs[1] - costs[0])
        } else if (costs.length === 1) {
          rowPenalties.push(costs[0])
        } else {
          rowPenalties.push(0)
        }
      } else {
        rowPenalties.push(-1)
      }
    }

    const colPenalties: number[] = []
    for (let j = 0; j < n; j++) {
      if (demandLeft[j] > 0) {
        const costs = costMatrix
          .map((row) => row[j])
          .map((c, i) => (supplyLeft[i] > 0 ? c : Number.MAX_SAFE_INTEGER))
          .filter((c) => c !== Number.MAX_SAFE_INTEGER)
        if (costs.length >= 2) {
          costs.sort((a, b) => a - b)
          colPenalties.push(costs[1] - costs[0])
        } else if (costs.length === 1) {
          colPenalties.push(costs[0])
        } else {
          colPenalties.push(0)
        }
      } else {
        colPenalties.push(-1)
      }
    }

    // Find cell with maximum penalty
    let maxPenalty = -1
    let maxI = -1
    let maxJ = -1
    let isRow = true

    for (let i = 0; i < m; i++) {
      if (rowPenalties[i] > maxPenalty) {
        maxPenalty = rowPenalties[i]
        maxI = i
        isRow = true
      }
    }

    for (let j = 0; j < n; j++) {
      if (colPenalties[j] > maxPenalty) {
        maxPenalty = colPenalties[j]
        maxJ = j
        isRow = false
      }
    }

    // Find minimum cost cell in selected row/column
    if (isRow && maxI !== -1) {
      let minCost = Number.POSITIVE_INFINITY
      for (let j = 0; j < n; j++) {
        if (demandLeft[j] > 0 && costMatrix[maxI][j] < minCost) {
          minCost = costMatrix[maxI][j]
          maxJ = j
        }
      }
    } else if (!isRow && maxJ !== -1) {
      let minCost = Number.POSITIVE_INFINITY
      for (let i = 0; i < m; i++) {
        if (supplyLeft[i] > 0 && costMatrix[i][maxJ] < minCost) {
          minCost = costMatrix[i][maxJ]
          maxI = i
        }
      }
    }

    // Allocate
    if (maxI !== -1 && maxJ !== -1 && supplyLeft[maxI] > 0 && demandLeft[maxJ] > 0) {
      const quantity = Math.min(supplyLeft[maxI], demandLeft[maxJ])
      allocation[maxI][maxJ] += quantity
      supplyLeft[maxI] -= quantity
      demandLeft[maxJ] -= quantity
      usedCells.add(`${maxI},${maxJ}`)
    } else {
      break
    }
  }

  // Calculate total cost
  let totalCost = 0
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      totalCost += allocation[i][j] * costMatrix[i][j]
    }
  }

  return { allocation, totalCost }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { num_supply, num_demand, cost_matrix, supply, demand } = body

    const { allocation, totalCost } = vogelsApproximationMethod(cost_matrix, supply, demand)

    return NextResponse.json({
      status: "Optimal",
      total_cost: totalCost,
      allocation: allocation,
      is_balanced: supply.reduce((a, b) => a + b, 0) === demand.reduce((a, b) => a + b, 0),
    })
  } catch (error) {
    return NextResponse.json(
      { status: "Error", error_message: String(error), total_cost: null, allocation: null },
      { status: 400 },
    )
  }
}
