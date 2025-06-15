import AppPage from "@/components/ui-components/AppPage";
import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import animations
import Grid from "@mui/material/Grid2";
interface StepInfo {
  title: string;
  content: React.ReactElement;
}

const OnboardTenant = () => {
  const [steps, setSteps] = useState<StepInfo[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const onNext = async () => {
    if (currentStep < steps.length - 1) {
      await new Promise((res) => setTimeout(res, 500));
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <AppPage
      title="Onboard New Tenant"
      content={
        <Paper variant="outlined" sx={{ padding: "1rem" }}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <Typography>Total Steps: {steps.length}</Typography>
            </Grid>
            <Grid size={6}>
              <Stack direction="row" justifyContent="flex-end">
                {/* Animated Button */}
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="contained"
                    onClick={() =>
                      setSteps((prev) => [
                        ...prev,
                        {
                          title: `Step ${prev.length}`,
                          content: (
                            <Typography variant="h1">{`Step ${prev.length}`}</Typography>
                          ),
                        },
                      ])
                    }
                  >
                    Add
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button
                    onClick={() => {
                      setSteps([]);
                      setCurrentStep(0);
                    }}
                  >
                    Clear
                  </Button>
                </motion.div>
              </Stack>
            </Grid>
            <Grid size={12}>
              <Grid container spacing={0.8}>
                {steps.map((_, index) => (
                  <Grid key={index}>
                    {/* Animated Step Indicator */}
                    <motion.div whileTap={{ scale: 0.8 }}>
                      <Typography
                        variant="h5"
                        onClick={() => setCurrentStep(index)}
                        sx={{
                          cursor: "pointer",
                          backgroundColor:
                            currentStep === index ? "darkgreen" : "ghostwhite",
                          borderRadius: "50%",
                          width: 50,
                          height: 50,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: currentStep === index ? "white" : "black",
                          fontWeight: "bold",
                          border: "2px solid darkgreen",
                          transition: "background-color 0.3s ease",
                          "&:hover": {
                            backgroundColor:
                              currentStep === index ? "darkgreen" : "#f0f0f0",
                          },
                        }}
                      >
                        {index}
                      </Typography>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
          <Grid container>
            <Grid size={12} sx={{ height: "50vh" }}>
              <Paper sx={{ padding: "1rem", height: "100%" }}>
                <AnimatePresence mode="wait">
                  {/* Animated Step Content */}
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Typography>{steps[currentStep]?.title}</Typography>
                    <Divider />
                    {steps[currentStep]?.content}
                  </motion.div>
                </AnimatePresence>
              </Paper>
            </Grid>
            <Grid size={12}>
              {/* Animated Navigation Buttons */}
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                >
                  Prev
                </Button>
              </motion.div>
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  onClick={onNext}
                  disabled={
                    steps.length === 0 || currentStep === steps.length - 1
                  }
                >
                  Next
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </Paper>
      }
    />
  );
};

export default OnboardTenant;
