import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface DashboardState {
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  isRightPanelOpen: boolean;
  searchQuery: string;
  notificationFilter: 'all' | 'unread' | 'read';
}

const initialState: DashboardState = {
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,
  isRightPanelOpen: false,
  searchQuery: '',
  notificationFilter: 'all',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.isSidebarCollapsed = action.payload;
    },
    toggleMobileSidebar(state) {
      state.isMobileSidebarOpen = !state.isMobileSidebarOpen;
    },
    setMobileSidebarOpen(state, action: PayloadAction<boolean>) {
      state.isMobileSidebarOpen = action.payload;
    },
    toggleRightPanel(state) {
      state.isRightPanelOpen = !state.isRightPanelOpen;
    },
    setRightPanelOpen(state, action: PayloadAction<boolean>) {
      state.isRightPanelOpen = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setNotificationFilter(state, action: PayloadAction<'all' | 'unread' | 'read'>) {
      state.notificationFilter = action.payload;
    },
    resetDashboardUi(state) {
      state.isMobileSidebarOpen = false;
      state.isRightPanelOpen = false;
      state.searchQuery = '';
      state.notificationFilter = 'all';
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  toggleMobileSidebar,
  setMobileSidebarOpen,
  toggleRightPanel,
  setRightPanelOpen,
  setSearchQuery,
  setNotificationFilter,
  resetDashboardUi,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
