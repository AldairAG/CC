import React, { cloneElement, isValidElement, useState } from "react";
import { twMerge } from "tailwind-merge";

interface TabsProps {
    activeTab?: string;
    setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
    defaultValue: string;
    children: React.ReactNode;
    className?: string;
}

interface TabsListProps {
    children: React.ReactNode;
    activeTab?: string;
    setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
    className?: string;
}

interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    activeTab?: string;
    setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
    className?: string;
    activeClassName?: string;
    inactiveClassName?: string;
}

interface TabsContentProps {
    value: string;
    activeTab?: string;
    children: React.ReactNode;
    className?: string;
}

const Tabs: React.FC<TabsProps> = ({ defaultValue, children, className, activeTab: externalActiveTab, setActiveTab: externalSetActiveTab }) => {
    const [internalActiveTab, internalSetActiveTab] = useState<string>(defaultValue);
    
    // Use external activeTab and setter if provided, otherwise use internal state
    const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
    const setActiveTab = externalSetActiveTab !== undefined ? externalSetActiveTab : internalSetActiveTab;

    // Función recursiva para procesar elementos profundamente anidados
    const processChildren = (children: React.ReactNode): React.ReactNode => {
        return React.Children.map(children, (child) => {
            if (isValidElement(child)) {
                // Si es TabsList, clonamos con props
                if (child.type === TabsList) {
                    return cloneElement(child as React.ReactElement<TabsListProps>, { activeTab, setActiveTab });
                }
                // Si es TabsContent, clonamos con props
                else if (child.type === TabsContent) {
                    return cloneElement(child as React.ReactElement<TabsContentProps>, { activeTab });
                }
                // Si tiene hijos y no es un componente de Tabs, procesamos sus hijos recursivamente
                else if (child.props && typeof child.props === 'object' && 'children' in child.props) {
                    // Create a properly typed clone with processed children
                    const childProps = { ...child.props };
                    const processedChildChildren = processChildren(child.props.children as React.ReactNode);
                    return React.cloneElement(child, childProps, processedChildChildren);
                }
            }
            // Si no es un elemento válido o no tiene hijos, lo devolvemos tal como está
            return child;
        });
    };

    const processedChildren = processChildren(children);

    return (
        <div className={twMerge("w-full", className)}>
            {processedChildren}
        </div>
    );
};

const TabsList: React.FC<TabsListProps> = ({ children, activeTab, setActiveTab, className }) => {
    const childrenWithProps = React.Children.map(children, (child) => {
        if (isValidElement(child) && child.type === TabsTrigger) {
            return cloneElement(child as React.ReactElement<TabsTriggerProps>, { activeTab, setActiveTab });
        }
        return child;
    });

    return (
        <div className={twMerge("flex", className)}>
            {childrenWithProps}
        </div>
    );
};

const TabsTrigger: React.FC<TabsTriggerProps> = ({
    value,
    children,
    activeTab,
    setActiveTab,
    className,
    activeClassName = "border-blue-500 font-bold stroke-3 text-blue-500",  
    inactiveClassName = "border-transparent"
}) => {
    const isActive = activeTab === value;
  
    return (
        <button
            type="button"
            className={twMerge(
                "px-4 py-2 transition-colors",
                // Solo agregar border-b-2 si no hay border-none en las clases personalizadas
                !className?.includes('border-none') && !activeClassName?.includes('border-none') ? "border-b-2" : "",
                isActive ? activeClassName : inactiveClassName,
                className
            )}
            onClick={() => setActiveTab?.(value)}
        >
            {children}
        </button>
    );
};

const TabsContent: React.FC<TabsContentProps> = ({ value, activeTab, children, className }) => {
    if (activeTab !== value) return null;
    
    return (
        <div className={twMerge("mt-4", className)}>
            {children}
        </div>
    );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };