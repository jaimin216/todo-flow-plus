import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, CheckCircle, Clock } from "lucide-react";

interface TaskData {
  name: string;
  value: number;
  color: string;
}

const mockData: TaskData[] = [
  { name: 'Completed', value: 65, color: 'hsl(var(--success))' },
  { name: 'In Progress', value: 20, color: 'hsl(var(--warning))' },
  { name: 'Pending', value: 15, color: 'hsl(var(--muted))' }
];

export const TaskCompletionChart = () => {
  return (
    <Card className="chart-container">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center">
          <Target className="h-5 w-5 mr-2 text-primary" />
          Task Completion
        </CardTitle>
        <p className="text-sm text-muted-foreground">This week's progress overview</p>
      </CardHeader>
      
      <CardContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="h-48"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                animationBegin={300}
                animationDuration={800}
              >
                {mockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.3)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          {mockData.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-1">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
              <p className="text-lg font-bold">{item.value}%</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};