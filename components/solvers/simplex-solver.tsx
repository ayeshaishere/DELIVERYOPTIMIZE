"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Download, TrendingDown } from "lucide-react"

interface SimplexResult {
  status: string
  optimal_value: number | null
  variable_values: number[] | null
  shadow_prices: number[] | null
  reduced_costs: number[] | null
  model_summary?: string
}

export default function SimplexSolver() {
  const [numVars, setNumVars] = useState(10)
  const [numConstraints, setNumConstraints] = useState(10)
  const [objective, setObjective] = useState("Minimize")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SimplexResult | null>(null)
  const [objCoeffs, setObjCoeffs] = useState<number[]>(Array(10).fill(0))
  const [constraints, setConstraints] = useState<number[][]>(
    Array(10)
      .fill(null)
      .map(() => Array(10).fill(0)),
  )
  const [constraintTypes, setConstraintTypes] = useState<string[]>(Array(10).fill("<="))
  const [rhsValues, setRhsValues] = useState<number[]>(Array(10).fill(100))

  const loadExampleData = () => {
    const exampleCoeffs = [12, 14, 11, 13, 15, 10, 12, 14, 13, 11]
    const exampleConstraints = [
      [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 2, 1, 1, 1, 1, 1, 1, 1],
    ]
    const exampleRhs = [50, 50, 20, 20, 15, 15, 10, 100, 80, 75]

    setObjCoeffs(exampleCoeffs)
    setConstraints(exampleConstraints)
    setRhsValues(exampleRhs)
  }

  const handleSolve = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/solvers/simplex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objective_type: objective,
          num_vars: numVars,
          num_constraints: numConstraints,
          obj_coeffs: objCoeffs.slice(0, numVars),
          constraint_coeffs: constraints.slice(0, numConstraints).map((c) => c.slice(0, numVars)),
          constraint_types: constraintTypes.slice(0, numConstraints),
          rhs_values: rhsValues.slice(0, numConstraints),
        }),
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Solve error:", error)
      setResult({
        status: "Error",
        optimal_value: null,
        variable_values: null,
        shadow_prices: null,
        reduced_costs: null,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="input" className="w-full">
        <TabsList className="bg-slate-700/50 border border-slate-600">
          <TabsTrigger value="input" className="data-[state=active]:bg-orange-600">
            Input
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!result} className="data-[state=active]:bg-orange-600">
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
              <Label className="text-slate-300 text-sm">Optimization Type</Label>
              <select
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full mt-2 p-3 border border-slate-600 rounded-lg bg-slate-800 text-white hover:border-orange-500 transition"
              >
                <option>Minimize</option>
                <option>Maximize</option>
              </select>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
              <Label className="text-slate-300 text-sm">Variables</Label>
              <Input
                type="number"
                value={numVars}
                onChange={(e) => setNumVars(Number.parseInt(e.target.value))}
                min="1"
                max="20"
                className="mt-2 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
              <Label className="text-slate-300 text-sm">Constraints</Label>
              <Input
                type="number"
                value={numConstraints}
                onChange={(e) => setNumConstraints(Number.parseInt(e.target.value))}
                min="1"
                max="20"
                className="mt-2 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={loadExampleData}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center gap-2 bg-transparent"
            >
              <Download className="w-4 h-4" />
              Load Example
            </Button>
          </div>

          <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-700/50 rounded-lg p-6">
            <Label className="text-white font-semibold mb-4 block flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-orange-500" />
              Objective Coefficients
            </Label>
            <div className="grid grid-cols-5 gap-3">
              {objCoeffs.slice(0, numVars).map((val, i) => (
                <div key={`obj-${i}`} className="flex flex-col">
                  <label className="text-xs text-slate-400 mb-1">x{i + 1}</label>
                  <Input
                    type="number"
                    value={val}
                    onChange={(e) => {
                      const newCoeffs = [...objCoeffs]
                      newCoeffs[i] = Number.parseFloat(e.target.value) || 0
                      setObjCoeffs(newCoeffs)
                    }}
                    className="bg-slate-800 border-slate-600 text-white text-center"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-white font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-slate-400" />
              Constraints
            </Label>
            {constraints.slice(0, numConstraints).map((constraint, i) => (
              <div
                key={`constraint-${i}`}
                className="flex gap-2 items-center bg-slate-700/50 p-3 rounded-lg border border-slate-600"
              >
                <span className="text-slate-400 font-semibold min-w-fit">C{i + 1}:</span>
                <div className="flex-1 grid grid-cols-5 gap-1">
                  {constraint.slice(0, numVars).map((val, j) => (
                    <Input
                      key={`const-${i}-${j}`}
                      type="number"
                      value={val}
                      onChange={(e) => {
                        const newConstraints = constraints.map((c) => [...c])
                        newConstraints[i][j] = Number.parseFloat(e.target.value) || 0
                        setConstraints(newConstraints)
                      }}
                      className="text-sm bg-slate-800 border-slate-600 text-white text-center"
                    />
                  ))}
                </div>
                <select
                  value={constraintTypes[i]}
                  onChange={(e) => {
                    const newTypes = [...constraintTypes]
                    newTypes[i] = e.target.value
                    setConstraintTypes(newTypes)
                  }}
                  className="p-2 border border-slate-600 rounded bg-slate-800 text-white"
                >
                  <option>{"<="}</option>
                  <option>{">="}</option>
                  <option>{"="}</option>
                </select>
                <Input
                  type="number"
                  value={rhsValues[i]}
                  onChange={(e) => {
                    const newRhs = [...rhsValues]
                    newRhs[i] = Number.parseFloat(e.target.value) || 0
                    setRhsValues(newRhs)
                  }}
                  className="w-24 bg-slate-800 border-slate-600 text-white text-center"
                />
              </div>
            ))}
          </div>

          <Button
            onClick={handleSolve}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-6 text-lg font-semibold transition-all"
          >
            {loading ? "Solving..." : "Solve Simplex Model"}
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
                      <p className="text-sm text-slate-400">Optimal Value (Z)</p>
                      <p className="text-2xl font-bold text-green-400 mt-1">
                        ${result.optimal_value !== null ? result.optimal_value.toFixed(2) : "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {result.variable_values && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-white mb-4">Decision Variables</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {result.variable_values.map((val, i) => (
                        <div key={`var-${i}`} className="p-3 bg-orange-500/20 rounded border border-orange-700/50">
                          <p className="text-xs text-slate-400">x{i + 1}</p>
                          <p className="font-bold text-orange-400 mt-1">{val.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {result.shadow_prices && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-white mb-4">Shadow Prices (Dual Values)</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {result.shadow_prices.map((val, i) => (
                        <div key={`shadow-${i}`} className="p-3 bg-blue-500/20 rounded border border-blue-700/50">
                          <p className="text-xs text-slate-400">C{i + 1}</p>
                          <p className="font-bold text-blue-400 mt-1">${val.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {result.reduced_costs && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-white mb-4">Reduced Costs</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {result.reduced_costs.map((val, i) => (
                        <div key={`rc-${i}`} className="p-3 bg-purple-500/20 rounded border border-purple-700/50">
                          <p className="text-xs text-slate-400">RC{i + 1}</p>
                          <p className="font-bold text-purple-400 mt-1">{val.toFixed(2)}</p>
                        </div>
                      ))}
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
