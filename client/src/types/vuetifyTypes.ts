// Types that should be exported from Vuetify but are not

// vuetify/lib/components/VDataTable/index.d.mts
type SelectItemKey =
  | boolean
  | string
  | (string | number)[]
  | ((item: Record<string, any>, fallback?: any) => any);
type DataTableCompareFunction<T = any> = (a: T, b: T) => number;
type FilterFunction = (
  value: string,
  query: string,
  item?: InternalItem,
) => FilterMatch;
interface InternalItem<T = any> {
  value: any;
  raw: T;
}
type FilterMatch = boolean | number | [number, number] | [number, number][];
type ItemKeySlot<T> = {
  value: any;
  index: number;
  item: T;
  internalItem: any;
};
type HeaderCellProps =
  | Record<string, any>
  | ((
      data: Pick<ItemKeySlot<any>, "index" | "item" | "internalItem" | "value">,
    ) => Record<string, any>);

export type DataTableHeader = {
  key?:
    | "data-table-group"
    | "data-table-select"
    | "data-table-expand"
    | (string & {});
  value?: SelectItemKey;
  title?: string;
  fixed?: boolean;
  align?: "start" | "end" | "center";
  width?: number | string;
  minWidth?: string;
  maxWidth?: string;
  headerProps?: Record<string, any>;
  cellProps?: HeaderCellProps;
  sortable?: boolean;
  sort?: DataTableCompareFunction;
  filter?: FilterFunction;
  children?: DataTableHeader[];
};
