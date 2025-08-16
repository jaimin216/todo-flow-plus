import { useState } from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Plus,
  ShoppingCart,
  Home,
  Car,
  Coffee,
  MoreHorizontal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
}

interface FinanceData {
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  categories: Array<{
    name: string;
    spent: number;
    budget: number;
    icon: any;
    color: string;
  }>;
  recentTransactions: Transaction[];
}

const mockFinanceData: FinanceData = {
  monthlyIncome: 5500,
  monthlyExpenses: 3200,
  savingsRate: 42,
  categories: [
    { 
      name: "Food", 
      spent: 450, 
      budget: 600, 
      icon: Coffee, 
      color: "text-warning" 
    },
    { 
      name: "Housing", 
      spent: 1200, 
      budget: 1500, 
      icon: Home, 
      color: "text-primary" 
    },
    { 
      name: "Transport", 
      spent: 320, 
      budget: 400, 
      icon: Car, 
      color: "text-success" 
    },
    { 
      name: "Shopping", 
      spent: 280, 
      budget: 300, 
      icon: ShoppingCart, 
      color: "text-destructive" 
    }
  ],
  recentTransactions: [
    {
      id: '1',
      amount: -45.50,
      category: 'Food',
      description: 'Grocery shopping',
      date: '2024-01-15',
      type: 'expense'
    },
    {
      id: '2',
      amount: 2500,
      category: 'Salary',
      description: 'Monthly salary',
      date: '2024-01-01',
      type: 'income'
    }
  ]
};

export const FinanceWidget = () => {
  const [financeData] = useState<FinanceData>(mockFinanceData);
  
  const totalBudget = financeData.categories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = financeData.categories.reduce((sum, cat) => sum + cat.spent, 0);
  const budgetUsed = (totalSpent / totalBudget) * 100;

  return (
    <Card className="widget-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Finance Tracker
          </CardTitle>
          <Button variant="ghost" size="sm" className="hover-glow">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Monthly Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-success/10 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-success mr-1" />
              <span className="text-sm font-medium text-success">Income</span>
            </div>
            <p className="text-xl font-bold">
              ${financeData.monthlyIncome.toLocaleString()}
            </p>
          </div>
          
          <div className="text-center p-3 bg-destructive/10 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <TrendingDown className="h-4 w-4 text-destructive mr-1" />
              <span className="text-sm font-medium text-destructive">Expenses</span>
            </div>
            <p className="text-xl font-bold">
              ${financeData.monthlyExpenses.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="p-3 bg-primary/10 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Savings Rate</span>
            <Badge variant="secondary">{financeData.savingsRate}%</Badge>
          </div>
          <Progress value={financeData.savingsRate} className="h-2" />
        </div>

        {/* Category Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            Category Spending
          </h4>
          
          {financeData.categories.map((category, index) => {
            const percentage = (category.spent / category.budget) * 100;
            const isOverBudget = percentage > 100;
            
            return (
              <motion.div
                key={category.name}
                className="space-y-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <category.icon className={`h-4 w-4 ${category.color}`} />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">
                      ${category.spent}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      /${category.budget}
                    </span>
                  </div>
                </div>
                
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className={`h-2 ${isOverBudget ? 'bg-destructive/20' : ''}`}
                />
                
                {isOverBudget && (
                  <Badge variant="destructive" className="text-xs">
                    Over budget by ${(category.spent - category.budget).toFixed(0)}
                  </Badge>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Budget Summary */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Budget Used</span>
            <div className="flex items-center space-x-2">
              <span className="font-medium">{budgetUsed.toFixed(1)}%</span>
              <Badge variant={budgetUsed > 90 ? "destructive" : "secondary"}>
                ${totalSpent} / ${totalBudget}
              </Badge>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full hover-glow">
          View Detailed Report
        </Button>
      </CardContent>
    </Card>
  );
};