import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

const mockData = [
  { category: 'Food', amount: 450, budget: 600 },
  { category: 'Housing', amount: 1200, budget: 1500 },
  { category: 'Transport', amount: 320, budget: 400 },
  { category: 'Shopping', amount: 280, budget: 300 },
  { category: 'Entertainment', amount: 150, budget: 200 }
];

export const FinanceMiniDashboard = () => {
  const totalSpent = mockData.reduce((sum, item) => sum + item.amount, 0);
  const totalBudget = mockData.reduce((sum, item) => sum + item.budget, 0);
  const budgetUsage = (totalSpent / totalBudget) * 100;

  return (
    <Card className="chart-container">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-primary" />
          Spending Overview
        </CardTitle>
        <p className="text-sm text-muted-foreground">Monthly budget vs actual spending</p>
      </CardHeader>
      
      <CardContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="h-40"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData}>
              <XAxis 
                dataKey="category" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.3)'
                }}
              />
              <Bar 
                dataKey="budget" 
                fill="hsl(var(--muted))" 
                radius={[2, 2, 0, 0]}
                animationBegin={300}
                animationDuration={800}
              />
              <Bar 
                dataKey="amount" 
                fill="hsl(var(--primary))" 
                radius={[2, 2, 0, 0]}
                animationBegin={500}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
        
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="h-4 w-4 text-primary mr-1" />
              <span className="text-xs text-muted-foreground">Spent</span>
            </div>
            <p className="text-lg font-bold text-primary">${totalSpent.toLocaleString()}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-success mr-1" />
              <span className="text-xs text-muted-foreground">Budget</span>
            </div>
            <p className="text-lg font-bold text-success">${totalBudget.toLocaleString()}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-1">
              {budgetUsage > 90 ? (
                <TrendingDown className="h-4 w-4 text-destructive mr-1" />
              ) : (
                <TrendingUp className="h-4 w-4 text-success mr-1" />
              )}
              <span className="text-xs text-muted-foreground">Usage</span>
            </div>
            <p className={`text-lg font-bold ${budgetUsage > 90 ? 'text-destructive' : 'text-success'}`}>
              {budgetUsage.toFixed(0)}%
            </p>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};