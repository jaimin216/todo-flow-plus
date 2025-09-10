import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar } from "lucide-react";

const mockData = [
  { day: 'Mon', tasks: 8, focus: 150 },
  { day: 'Tue', tasks: 12, focus: 200 },
  { day: 'Wed', tasks: 6, focus: 120 },
  { day: 'Thu', tasks: 15, focus: 280 },
  { day: 'Fri', tasks: 10, focus: 160 },
  { day: 'Sat', tasks: 4, focus: 80 },
  { day: 'Sun', tasks: 3, focus: 60 }
];

export const WeeklyProductivityChart = () => {
  return (
    <Card className="chart-container">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          Weekly Productivity
        </CardTitle>
        <p className="text-sm text-muted-foreground">Tasks completed & focus time</p>
      </CardHeader>
      
      <CardContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="h-48"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData}>
              <defs>
                <linearGradient id="taskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.3)'
                }}
              />
              <Area
                type="monotone"
                dataKey="tasks"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#taskGradient)"
                animationBegin={300}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="flex items-center mb-1">
              <Calendar className="h-4 w-4 text-success mr-1" />
              <span className="text-xs text-muted-foreground">Avg Daily</span>
            </div>
            <p className="text-lg font-bold text-success">8.3 tasks</p>
          </div>
          <div className="text-center">
            <div className="flex items-center mb-1">
              <TrendingUp className="h-4 w-4 text-primary mr-1" />
              <span className="text-xs text-muted-foreground">Total Focus</span>
            </div>
            <p className="text-lg font-bold text-primary">17.5 hrs</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};