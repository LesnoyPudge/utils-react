import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { createContext, ReactNode, useState } from 'react';
import { ChildrenAsNodeOrFunction } from '@components';
import { objectKeys } from '@utils';



type ProvidedTabs = Record<string, ReactNode>;

type TabProps<KEY extends keyof ProvidedTabs> = {
    role: 'tab';
    controls: `tabPanel-${KEY}`;
    id: `tab-${KEY}`;
}

type TabPanelProps<KEY extends keyof ProvidedTabs> = {
    id: `tabPanel-${KEY}`;
    labelledBy: `tab-${KEY}`;
}

interface Tab<VALUES> {
    identifier: keyof VALUES;
    tab: ReactNode;
}

export interface TabContext<VALUES extends ProvidedTabs> {
    tabs: Record<keyof VALUES, Tab<VALUES>>;
    currentTab: Tab<VALUES>;
    changeTab: Record<keyof VALUES, () => void>;
    isActive: Record<keyof VALUES, boolean>;
    tabProps: Record<keyof VALUES, TabProps<Extract<keyof VALUES, string>>>;
    tabPanelProps: Record<keyof VALUES, TabPanelProps<Extract<keyof VALUES, string>>>;
}

interface TabContextProvider<VALUES extends ProvidedTabs> extends PropsWithChildrenAsNodeOrFunction<TabContext<VALUES>> {
    tabs: VALUES;
    initialTab?: keyof VALUES;
    onTabChange?: (prevent: () => void) => void;
}

export const TabContext = createContext<TabContext<any>>();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const TabContextProvider = <T extends ProvidedTabs>(props: TabContextProvider<T>) => {
    const { tabs, initialTab, onTabChange, children } = props;
    const tabsArray = objectKeys(tabs);

    const getCurrentTab = (identifier: keyof T): Tab<T> => ({
        identifier: identifier.toString(),
        tab: tabs[identifier],
    });

    const [currentTab, setCurrentTab] = useState<Tab<T>>(
        () => getCurrentTab(initialTab?.toString() || tabsArray[0]),
    );

    const changeTab = tabsArray.reduce((acc, key) => {
        acc[key] = () => {
            // if (key === currentTab.identifier) return;
            if (!onTabChange) return setCurrentTab(getCurrentTab(key));

            let isPrevented = false;

            const prevent = () => {
                isPrevented = true;
            };

            onTabChange(prevent);

            if (!isPrevented) setCurrentTab(getCurrentTab(key));
        };

        return acc;
    }, {} as Record<keyof T, () => void>);

    const transformedTabs = tabsArray.reduce((acc, key) => {
        acc[key] = {
            identifier: key,
            tab: tabs[key],
        };

        return acc;
    }, {} as Record<keyof T, Tab<T>>);

    const isActive = tabsArray.reduce((acc, key) => {
        acc[key] = currentTab.identifier === key;

        return acc;
    }, {} as Record<keyof T, boolean>);

    const tabProps = tabsArray.reduce((acc, key) => {
        acc[key] = {
            role: 'tab',
            controls: `tabPanel-${key.toString()}`,
            id: `tab-${key.toString()}`,
        };

        return acc;
    }, {} as Record<keyof T, TabProps<string>>) as Record<keyof T, TabProps<Extract<keyof T, string>>>;

    const tabPanelProps = tabsArray.reduce((acc, key) => {
        acc[key] = {
            id: `tabPanel-${key.toString()}`,
            labelledBy: `tab-${key.toString()}`,
        };

        return acc;
    }, {} as Record<keyof T, TabPanelProps<string>>) as Record<keyof T, TabPanelProps<Extract<keyof T, string>>>;

    const contextValues: TabContext<T> = {
        tabs: transformedTabs,
        currentTab,
        changeTab,
        isActive,
        tabProps,
        tabPanelProps,
    };

    return (
        <TabContext.Provider value={contextValues}>
            <ChildrenAsNodeOrFunction args={contextValues}>
                {children}
            </ChildrenAsNodeOrFunction>
        </TabContext.Provider>
    );
};