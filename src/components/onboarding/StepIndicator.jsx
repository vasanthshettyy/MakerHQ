import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

export default function StepIndicator({ steps, currentStep }) {
    return (
        <div className="flex items-center justify-between gap-2 mb-12 max-w-sm mx-auto">
            {steps.map((label, index) => {
                const stepNum = index + 1;
                const isCompleted = stepNum < currentStep;
                const isCurrent = stepNum === currentStep;
                const isLast = index === steps.length - 1;

                return (
                    <div key={label} className="flex-1 flex items-center last:flex-none">
                        <div className="flex flex-col items-center relative group">
                            {/* Step Circle */}
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: isCurrent ? 1.1 : 1,
                                    backgroundColor: isCompleted ? 'var(--color-primary)' : isCurrent ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                    borderColor: isCurrent ? 'var(--color-primary)' : 'transparent'
                                }}
                                className={cn(
                                    'w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold border-2 transition-all duration-500 shadow-lg',
                                    isCompleted ? 'text-white' : isCurrent ? 'text-primary' : 'text-text-muted border-white/5'
                                )}
                            >
                                {isCompleted ? (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                                        <Check className="w-5 h-5 stroke-[3]" />
                                    </motion.div>
                                ) : (
                                    <span>{stepNum}</span>
                                )}
                            </motion.div>

                            {/* Label */}
                            <span
                                className={cn(
                                    'absolute -bottom-7 text-[10px] font-extrabold uppercase tracking-widest whitespace-nowrap transition-colors duration-300',
                                    isCurrent ? 'text-primary' : isCompleted ? 'text-text-secondary' : 'text-text-dim'
                                )}
                            >
                                {label}
                            </span>
                        </div>

                        {/* Connector line */}
                        {!isLast && (
                            <div className="flex-1 mx-4 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
                                <motion.div
                                    initial={false}
                                    animate={{ width: isCompleted ? '100%' : '0%' }}
                                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                                    className="absolute inset-0 bg-primary"
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
