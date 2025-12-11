"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SimplexSolver from "@/components/solvers/simplex-solver"
import AssignmentSolver from "@/components/solvers/assignment-solver"
import TransportationSolver from "@/components/solvers/transportation-solver"
import { TrendingDown, Users, Truck } from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState("simplex")

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">DeliveryOptimize</h1>
              <p className="text-xs text-slate-400">Operations Research Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>All Systems Operational</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 text-balance">
            Intelligent Delivery Route Optimization
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl">
            Leverage advanced Operations Research algorithms to minimize costs, optimize assignments, and streamline
            delivery networks in real-time.
          </p>
          <div className="flex gap-4 mt-6 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
              <TrendingDown className="w-4 h-4 text-orange-500" />
              <span>Cost Optimization</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
              <Users className="w-4 h-4 text-blue-500" />
              <span>Smart Assignment</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
              <Truck className="w-4 h-4 text-green-500" />
              <span>Network Routing</span>
            </div>
          </div>
        </div>

        {/* Solver Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-12">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-slate-800/50 border border-slate-700">
              <TabsTrigger
                value="simplex"
                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white flex items-center gap-2"
              >
                <TrendingDown className="w-4 h-4" />
                <span className="hidden sm:inline">Simplex LP</span>
              </TabsTrigger>
              <TabsTrigger
                value="assignment"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Assignment</span>
              </TabsTrigger>
              <TabsTrigger
                value="transportation"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white flex items-center gap-2"
              >
                <Truck className="w-4 h-4" />
                <span className="hidden sm:inline">Transportation</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Simplex Tab */}
          <TabsContent value="simplex" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="bg-gradient-to-r from-orange-600/10 to-red-600/10 border-b border-slate-700">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-600/20 rounded-lg">
                      <TrendingDown className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <CardTitle className="text-white">Simplex Linear Programming</CardTitle>
                      <CardDescription>Minimize delivery costs with resource constraints</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <SimplexSolver />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignment Tab */}
          <TabsContent value="assignment" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border-b border-slate-700">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                      <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <CardTitle className="text-white">Order-Rider Assignment</CardTitle>
                      <CardDescription>Hungarian Algorithm for optimal matching</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <AssignmentSolver />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transportation Tab */}
          <TabsContent value="transportation" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="bg-gradient-to-r from-green-600/10 to-emerald-600/10 border-b border-slate-700">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-600/20 rounded-lg">
                      <Truck className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <CardTitle className="text-white">Network Transportation</CardTitle>
                      <CardDescription>VAM + MODI optimization for distribution</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <TransportationSolver />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="bg-gradient-to-br from-orange-900/40 to-red-900/20 border-orange-700/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-orange-600/30 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-orange-500" />
                </div>
                <CardTitle className="text-white text-lg">Cost Minimization</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300">
                Solve 10+ variable linear programs to minimize delivery costs across zones with constraints on rider
                capacity and demand forecasts.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/20 border-blue-700/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600/30 flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-500" />
                </div>
                <CardTitle className="text-white text-lg">Optimal Assignment</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300">
                Assign delivery partners to orders (up to 10×10 matrix) minimizing total time or distance using the
                Hungarian Algorithm.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/20 border-green-700/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-green-600/30 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-green-500" />
                </div>
                <CardTitle className="text-white text-lg">Network Routing</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300">
                Optimize food movement from kitchens through delivery hubs to customers using Vogel's Approximation
                Method and MODI optimization.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-slate-400">
          <p>DeliveryOptimize © 2025 | Advanced Operations Research Platform for Food Delivery Networks</p>
        </div>
      </footer>
    </main>
  )
}
