import { StoreConfig } from '@/lib/store-config';

export interface TabProps {
  config: Partial<StoreConfig>;
  setConfig: React.Dispatch<React.SetStateAction<Partial<StoreConfig>>>;
}
