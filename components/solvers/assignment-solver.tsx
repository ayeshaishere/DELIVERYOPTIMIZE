"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dice5, Users } from "lucide-react"

interface AssignmentResult {
  status: string
  total_cost: number | null
  assignments: Array<{
    ambulance: number
    emergency: number
    cost: number
  }> | null
  is_balanced: boolean | null
}

export default function AssignmentSolver() {
  const [matrixSize, setMatrixSize] = useState(10)
  const [costMatrix, setCostMatrix] = useState<number[][]>(
    Array(10)
      .fill(null)
      .map(() => Array(10).fill(0)),
  )
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AssignmentResult | null>(null)

  const loadExampleData = () => {
    const matrix = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => Math.floor(Math.random() * 50) + 5),
      )
    setCostMatrix(matrix)
  }

  const handleSolve = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/solvers/assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          num_riders: matrixSize,
          num_orders: matrixSize,
          cost_matrix: costMatrix.slice(0, matrixSize).map((row) => row.slice(0, matrixSize)),
        }),
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Solve error:", error)
      setResult({ status: "Error", total_cost: null, assignments: null, is_balanced: null })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="input" className="w-full">
        <TabsList className="bg-slate-700/50 border border-slate-600">
          <TabsTrigger value="input" className="data-[state=active]:bg-blue-600">
            Input
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!result} className="data-[state=active]:bg-blue-600">
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1 bg-slate-700/50 p-4 rounded-lg border border-slate-600">
              <Label className="text-slate-300 text-sm">Matrix Size (Riders × Orders)</Label>
              <Input
                type="number"
                value={matrixSize}
                onChange={(e) => {
                  const size = Number.parseInt(e.target.value)
                  setMatrixSize(size)
                  setCostMatrix(
                    Array(size)
                      .fill(null)
                      .map(() => Array(size).fill(0)),
                  )
                }}
                min="2"
                max="20"
                className="mt-2 bg-slate-800 border-slate-600 text-white"
              />
            </div>
            <Button
              onClick={loadExampleData}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Dice5 className="w-4 h-4" />
              Generate Random
            </Button>
          </div>

          <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-700/50 rounded-lg p-4 overflow-x-auto">
            <Label className="text-white font-semibold mb-4 block flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Delivery Time/Distance Matrix
            </Label>
            <div className="inline-block">
              <table className="border-collapse">
                <thead>
                  <tr>
                    <th className="border border-blue-700/50 p-3 bg-blue-900/30 w-12 text-xs text-slate-400 font-semibold">
                      R/O
                    </th>
                    {Array(matrixSize)
                      .fill(null)
                      .map((_, i) => (
                        <th
                          key={`head-${i}`}
                          className="border border-blue-700/50 p-3 bg-blue-900/30 w-16 text-xs text-slate-400 font-semibold"
                        >
                          O{i + 1}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {costMatrix.slice(0, matrixSize).map((row, i) => (
                    <tr key={`row-${i}`}>
                      <td className="border border-blue-700/50 p-3 bg-blue-900/30 font-semibold text-blue-400 text-sm">
                        R{i + 1}
                      </td>
                      {row.slice(0, matrixSize).map((val, j) => (
                        <td key={`cell-${i}-${j}`} className="border border-blue-700/50 p-0">
                          <Input
                            type="number"
                            value={val}
                            onChange={(e) => {
                              const newMatrix = costMatrix.map((r) => [...r])
                              newMatrix[i][j] = Number.parseFloat(e.target.value) || 0
                              setCostMatrix(newMatrix)
                            }}
                            className="w-16 h-12 border-0 text-center text-sm p-0 bg-slate-800 text-white rounded-none"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Button
            onClick={handleSolve}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-6 text-lg font-semibold transition-all"
          >
            {loading ? "Solving..." : "Solve Assignment Problem"}
          </Button>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {result && (
            <div className="space-y-4">
              <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-700/50">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Status</p>
                      <p className="text-2xl font-bold text-green-400 mt-1">{result.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Total Cost</p>
                      <p className="text-2xl font-bold text-green-400 mt-1">
                        ${result.total_cost !== null ? result.total_cost.toFixed(2) : "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {result.assignments && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-white mb-4">Optimal Rider-Order Assignments</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-blue-900/40 border-b border-blue-700/50">
                            <th className="p-3 text-left text-slate-300 font-semibold">Rider</th>
                            <th className="p-3 text-left text-slate-300 font-semibold">Order</th>
                            <th className="p-3 text-right text-slate-300 font-semibold">Cost</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.assignments.map((assignment, i) => (
                            <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                              <td className="p-3 font-semibold text-blue-400">R{assignment.ambulance}</td>
                              <td className="p-3 font-semibold text-blue-400">O{assignment.emergency}</td>
                              <td className="p-3 text-right text-slate-300">${assignment.cost.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
