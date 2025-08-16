import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return firstValue / secondValue;
      case "=":
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay("0");
    setWaitingForOperand(false);
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const buttons = [
    { label: "C", action: clear, className: "bg-destructive/10 text-destructive hover:bg-destructive/20" },
    { label: "CE", action: clearEntry, className: "bg-muted" },
    { label: "⌫", action: () => setDisplay(display.slice(0, -1) || "0"), className: "bg-muted" },
    { label: "÷", action: () => inputOperation("÷"), className: "bg-primary/10 text-primary hover:bg-primary/20" },
    
    { label: "7", action: () => inputNumber("7"), className: "" },
    { label: "8", action: () => inputNumber("8"), className: "" },
    { label: "9", action: () => inputNumber("9"), className: "" },
    { label: "×", action: () => inputOperation("×"), className: "bg-primary/10 text-primary hover:bg-primary/20" },
    
    { label: "4", action: () => inputNumber("4"), className: "" },
    { label: "5", action: () => inputNumber("5"), className: "" },
    { label: "6", action: () => inputNumber("6"), className: "" },
    { label: "-", action: () => inputOperation("-"), className: "bg-primary/10 text-primary hover:bg-primary/20" },
    
    { label: "1", action: () => inputNumber("1"), className: "" },
    { label: "2", action: () => inputNumber("2"), className: "" },
    { label: "3", action: () => inputNumber("3"), className: "" },
    { label: "+", action: () => inputOperation("+"), className: "bg-primary/10 text-primary hover:bg-primary/20" },
    
    { label: "0", action: () => inputNumber("0"), className: "col-span-2" },
    { label: ".", action: inputDecimal, className: "" },
    { label: "=", action: performCalculation, className: "bg-gradient-primary text-primary-foreground hover:shadow-glow" },
  ];

  return (
    <div className="p-6">
      <div className="max-w-sm mx-auto">
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-center bg-gradient-primary bg-clip-text text-transparent">
              Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Display */}
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-right text-2xl font-mono text-foreground min-h-[2rem] flex items-center justify-end">
                {display}
              </div>
            </div>

            {/* Buttons Grid */}
            <div className="grid grid-cols-4 gap-2">
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={cn(
                    "h-12 font-medium transition-smooth hover:shadow-card",
                    button.className
                  )}
                  onClick={button.action}
                >
                  {button.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};