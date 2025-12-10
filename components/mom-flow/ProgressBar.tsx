import React from 'react';
import { Check } from 'lucide-react';

interface ProgressBarProps {
    step: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ step }) => {
    const steps = [
        { num: 1, label: 'Details' },
        { num: 2, label: 'People' },
        { num: 3, label: 'Points' },
        { num: 4, label: 'Review' }
    ];

    return (
        <div className="mb-8 max-w-2xl mx-auto">
            <div className="flex justify-between relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2 rounded"></div>
                <div
                    className="absolute top-1/2 left-0 h-1 bg-blue-600 -z-10 -translate-y-1/2 rounded transition-all duration-300 ease-in-out"
                    style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((s) => (
                    <div key={s.num} className="flex flex-col items-center cursor-default bg-white px-2">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${step >= s.num ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                                }`}
                        >
                            {step > s.num ? <Check size={16} /> : s.num}
                        </div>
                        <span className={`text-xs mt-2 font-medium ${step >= s.num ? 'text-blue-700' : 'text-slate-400'}`}>
                            {s.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
