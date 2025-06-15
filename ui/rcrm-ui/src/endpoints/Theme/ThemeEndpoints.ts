export default {
  getPrimarySiteTheme: "Theme/primary-theme",
  getAllThemes: "Theme/all-themes",
  updateTheme: "Theme/update-theme",
  addTheme: "Theme/add-theme",
  deleteTheme: (themeId: string) => `Theme/delete-theme?themeId=${themeId}`,
};
