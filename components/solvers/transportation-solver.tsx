"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dice5, Truck } from "lucide-react"

interface TransportationResult {
  status: string
  total_cost: number | null
  allocation: number[][] | null
  is_balanced: boolean | null
}

export default function TransportationSolver() {
  const [numSupply, setNumSupply] = useState(5)
  const [numDemand, setNumDemand] = useState(5)
  const [supply, setSupply] = useState<number[]>(Array(5).fill(100))
  const [demand, setDemand] = useState<number[]>(Array(5).fill(100))
  const [costMatrix, setCostMatrix] = useState<number[][]>(
    Array(5)
      .fill(null)
      .map(() => Array(5).fill(0)),
  )
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TransportationResult | null>(null)

  const loadExampleData = () => {
    const matrix = Array(5)
      .fill(null)
      .map(() =>
        Array(5)
          .fill(null)
          .map(() => Math.floor(Math.random() * 30) + 5),
      )
    setCostMatrix(matrix)
    setSupply(Array(5).fill(100))
    setDemand(Array(5).fill(100))
  }

  const handleSolve = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/solvers/transportation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          num_supply: numSupply,
          num_demand: numDemand,
          cost_matrix: costMatrix.slice(0, numSupply).map((row) => row.slice(0, numDemand)),
          supply: supply.slice(0, numSupply),
          demand: demand.slice(0, numDemand),
        }),
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Solve error:", error)
      setResult({ status: "Error", total_cost: null, allocation: null, is_balanced: null })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="input" className="w-full">
        <TabsList className="bg-slate-700/50 border border-slate-600">
          <TabsTrigger value="input" className="data-[state=active]:bg-green-600">
            Input
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!result} className="data-[state=active]:bg-green-600">
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
              <Label className="text-slate-300 text-sm">Kitchens (Supply)</Label>
              <Input
                type="number"
                value={numSupply}
                onChange={(e) => {
                  const size = Number.parseInt(e.target.value)
                  setNumSupply(size)
                  setSupply(Array(size).fill(100))
                  setCostMatrix(
                    Array(size)
                      .fill(null)
                      .map(() => Array(numDemand).fill(0)),
                  )
                }}
                min="2"
                max="20"
                className="mt-2 bg-slate-800 border-slate-600 text-white"
              />
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
              <Label className="text-slate-300 text-sm">Customers (Demand)</Label>
              <Input
                type="number"
                value={numDemand}
                onChange={(e) => {
                  const size = Number.parseInt(e.target.value)
                  setNumDemand(size)
                  setDemand(Array(size).fill(100))
                  setCostMatrix(
                    Array(numSupply)
                      .fill(null)
                      .map(() => Array(size).fill(0)),
                  )
                }}
                min="2"
                max="20"
                className="mt-2 bg-slate-800 border-slate-600 text-white"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={loadExampleData}
                className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 justify-center"
              >
                <Dice5 className="w-4 h-4" />
                Example
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-700/50 rounded-lg p-4">
              <Label className="text-white font-semibold mb-3 block text-sm">Supply per Kitchen</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {supply.slice(0, numSupply).map((val, i) => (
                  <div key={`supply-${i}`} className="flex gap-2">
                    <span className="w-10 font-semibold text-green-400 text-sm">K{i + 1}</span>
                    <Input
                      type="number"
                      value={val}
                      onChange={(e) => {
                        const newSupply = [...supply]
                        newSupply[i] = Number.parseFloat(e.target.value) || 0
                        setSupply(newSupply)
                      }}
                      className="flex-1 bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-700/50 rounded-lg p-4">
              <Label className="text-white font-semibold mb-3 block text-sm">Demand per Customer Hub</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {demand.slice(0, numDemand).map((val, i) => (
                  <div key={`demand-${i}`} className="flex gap-2">
                    <span className="w-10 font-semibold text-green-400 text-sm">C{i + 1}</span>
                    <Input
                      type="number"
                      value={val}
                      onChange={(e) => {
                        const newDemand = [...demand]
                        newDemand[i] = Number.parseFloat(e.target.value) || 0
                        setDemand(newDemand)
                      }}
                      className="flex-1 bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-700/50 rounded-lg p-4 overflow-x-auto">
            <Label className="text-white font-semibold mb-4 block flex items-center gap-2">
              <Truck className="w-5 h-5 text-green-500" />
              Transportation Cost Matrix
            </Label>
            <div className="inline-block">
              <table className="border-collapse">
                <thead>
                  <tr>
                    <th className="border border-green-700/50 p-3 bg-green-900/30 w-12 text-xs text-slate-400 font-semibold">
                      K/C
                    </th>
                    {Array(numDemand)
                      .fill(null)
                      .map((_, i) => (
                        <th
                          key={`head-${i}`}
                          className="border border-green-700/50 p-3 bg-green-900/30 w-16 text-xs text-slate-400 font-semibold"
                        >
                          C{i + 1}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {costMatrix.slice(0, numSupply).map((row, i) => (
                    <tr key={`row-${i}`}>
                      <td className="border border-green-700/50 p-3 bg-green-900/30 font-semibold text-green-400 text-sm">
                        K{i + 1}
                      </td>
                      {row.slice(0, numDemand).map((val, j) => (
                        <td key={`cell-${i}-${j}`} className="border border-green-700/50 p-0">
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
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 text-lg font-semibold transition-all"
          >
            {loading ? "Solving..." : "Solve Transportation Problem"}
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

              {result.allocation && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-white mb-4">Optimal Allocation Matrix</h3>
                    <div className="overflow-x-auto">
                      <table className="border-collapse">
                        <thead>
                          <tr>
                            <th className="border border-green-700/50 p-3 bg-green-900/30 text-xs text-slate-400 font-semibold">
                              K/C
                            </th>
                            {Array(numDemand)
                              .fill(null)
                              .map((_, i) => (
                                <th
                                  key={`head-${i}`}
                                  className="border border-green-700/50 p-3 bg-green-900/30 text-xs text-slate-400 font-semibold"
                                >
                                  C{i + 1}
                                </th>
                              ))}
                          </tr>
                        </thead>
                        <tbody>
                          {result.allocation.map((row, i) => (
                            <tr key={`row-${i}`}>
                              <td className="border border-green-700/50 p-3 bg-green-900/30 font-semibold text-green-400 text-sm">
                                K{i + 1}
                              </td>
                              {row.map((val, j) => (
                                <td key={`cell-${i}-${j}`} className="border border-green-700/50 p-3 text-center">
                                  <span
                                    className={`font-semibold ${val > 0 ? "text-green-400 bg-green-900/30" : "text-slate-500"}`}
                                  >
                                    {val > 0 ? val.toFixed(0) : "-"}
                                  </span>
                                </td>
                              ))}
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
