import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Plus,
  ShoppingCart,
  Home,
  Car,
  Coffee,
  MoreHorizontal,
  Wallet,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

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
  recentTransactions: []
};

export const FinanceWidget = () => {
  const [financeData] = useState<FinanceData>(mockFinanceData);
  const [animatedValues, setAnimatedValues] = useState({ income: 0, expenses: 0, savings: 0 });
  const { toast } = useToast();
  
  const totalBudget = financeData.categories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = financeData.categories.reduce((sum, cat) => sum + cat.spent, 0);
  const budgetUsed = (totalSpent / totalBudget) * 100;
  const savingsRate = ((financeData.monthlyIncome - financeData.monthlyExpenses) / financeData.monthlyIncome) * 100;
  
  // Animate numbers on mount
  useEffect(() => {
    const animateValues = () => {
      const duration = 1000;
      const steps = 30;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setAnimatedValues({
          income: Math.floor(financeData.monthlyIncome * progress),
          expenses: Math.floor(financeData.monthlyExpenses * progress),
          savings: Math.floor((financeData.monthlyIncome - financeData.monthlyExpenses) * progress)
        });
        
        if (currentStep >= steps) {
          clearInterval(interval);
          setAnimatedValues({
            income: financeData.monthlyIncome,
            expenses: financeData.monthlyExpenses,
            savings: financeData.monthlyIncome - financeData.monthlyExpenses
          });
        }
      }, stepDuration);
    };
    
    animateValues();
  }, [financeData]);

  const addTransaction = (amount: number, category: string, type: 'income' | 'expense') => {
    toast({
      title: `${type === 'income' ? 'Income' : 'Expense'} Added`,
      description: `$${amount.toFixed(2)} added to ${category}`,
    });
  };

  return (
    <Card className="widget-card group">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-primary" />
            Finance Tracker
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={savingsRate >= 20 ? "default" : "secondary"} className="animate-fade-in">
              {savingsRate.toFixed(0)}% saved
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => addTransaction(500, 'Freelance', 'income')}>
                  <ArrowUpRight className="h-4 w-4 mr-2 text-success" />
                  Add Income
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addTransaction(50, 'Dining', 'expense')}>
                  <ArrowDownRight className="h-4 w-4 mr-2 text-destructive" />
                  Add Expense
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Target className="h-4 w-4 mr-2" />
                  Set Budget
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-5">
        {/* Monthly Overview */}
        <motion.div 
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className="space-y-2 p-3 rounded-lg bg-success/5 border border-success/20"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">Income</span>
            </div>
            <motion.p 
              className="text-2xl font-bold text-success"
              key={animatedValues.income}
            >
              ${animatedValues.income.toLocaleString()}
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="space-y-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              <span className="text-sm text-muted-foreground">Expenses</span>
            </div>
            <motion.p 
              className="text-2xl font-bold text-destructive"
              key={animatedValues.expenses}
            >
              ${animatedValues.expenses.toLocaleString()}
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Savings Section */}
        <motion.div 
          className="space-y-3 p-4 rounded-lg bg-primary/5 border border-primary/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wallet className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Monthly Savings</span>
            </div>
            <Badge variant={savingsRate >= 20 ? "default" : "secondary"}>
              {savingsRate.toFixed(1)}%
            </Badge>
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <Progress value={savingsRate} className="h-2" />
          </motion.div>
          <motion.p 
            className="text-xl font-bold text-primary"
            key={animatedValues.savings}
          >
            ${animatedValues.savings.toLocaleString()} saved
          </motion.p>
        </motion.div>

        {/* Category Spending */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h4 className="text-sm font-medium text-muted-foreground flex items-center">
            <Receipt className="h-4 w-4 mr-2" />
            Category Spending
          </h4>
          
          <div className="space-y-3">
            <AnimatePresence>
              {financeData.categories.map((category, index) => {
                const spentPercentage = (category.spent / category.budget) * 100;
                const isOverBudget = spentPercentage > 100;
                const isNearLimit = spentPercentage > 80 && !isOverBudget;
                
                return (
                  <motion.div
                    key={category.name}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      isOverBudget 
                        ? 'bg-destructive/5 border-destructive/20' 
                        : isNearLimit 
                        ? 'bg-warning/5 border-warning/20'
                        : 'bg-muted/20 border-border'
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    layout
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <category.icon className={`h-4 w-4 ${category.color}`} />
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          ${category.spent.toFixed(0)} / ${category.budget.toFixed(0)}
                        </span>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.2 }}
                        >
                          {isOverBudget ? (
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          ) : isNearLimit ? (
                            <AlertTriangle className="h-4 w-4 text-warning" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-success" />
                          )}
                        </motion.div>
                      </div>
                    </div>
                    
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                    >
                      <Progress 
                        value={Math.min(spentPercentage, 100)}
                        className={`h-2 ${
                          isOverBudget 
                            ? '[&>div]:bg-destructive' 
                            : isNearLimit 
                            ? '[&>div]:bg-warning'
                            : '[&>div]:bg-success'
                        }`}
                      />
                    </motion.div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {spentPercentage.toFixed(0)}% used
                      </span>
                      {isOverBudget && (
                        <motion.p 
                          className="text-xs text-destructive font-medium"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          Over by ${(category.spent - category.budget).toFixed(0)}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Budget Summary & Actions */}
        <motion.div 
          className="pt-4 border-t border-border space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Total Budget Usage
              </span>
              <motion.span 
                className="text-sm text-muted-foreground"
                key={budgetUsed}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {budgetUsed.toFixed(1)}%
              </motion.span>
            </div>
            <Progress value={budgetUsed} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="hover-lift">
              <Receipt className="h-4 w-4 mr-2" />
              View Report
            </Button>
            <Button variant="outline" size="sm" className="hover-lift">
              <Target className="h-4 w-4 mr-2" />
              Set Goals
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};