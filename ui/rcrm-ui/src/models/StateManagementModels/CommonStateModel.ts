export interface CommonStateModel {
  isDrawerOpen: boolean;
  isRightDrawerOpen: boolean;
  expandedGroupIds: number[];
  lastSelectedMenuItem: number;
  drawerContent: React.ReactElement | null;
}
