import React, { createContext, useState } from "react";
export type AppContextType = {
  search: string | undefined;
  setSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
  topicFilterPin: boolean;
  setTopicFilterPin: React.Dispatch<React.SetStateAction<boolean>>;
  topicFilterSortAsc: boolean;
  setTopicFilterSortAsc: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AppContext = createContext<AppContextType>({
  search: undefined,
  topicFilterPin: false,
  setTopicFilterPin: () => {},
  topicFilterSortAsc: false,
  setTopicFilterSortAsc: () => {},
  setSearch: () => {},
});

const AppProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [topicFilterPin, setTopicFilterPin] = useState(false);
  const [topicFilterSortAsc, setTopicFilterSortAsc] = useState(false);
  const [search, setSearch] = useState<string | undefined>(undefined);
  return (
    <AppContext.Provider
      value={{
        topicFilterPin,
        setTopicFilterPin,
        topicFilterSortAsc,
        setTopicFilterSortAsc,
        search,
        setSearch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
