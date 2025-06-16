namespace Jupiter.Helpers.Helpers
{
    public class PageParams
    {
        const int maxPageSize = 100;
        private int _pageIndex = 1;
        private int _pageSize = 10;

        public int Page
        {
            get
            {
                return _pageIndex;
            }
            set
            {
                _pageIndex = value;
            }
        }

        public int PageSize
        {
            get
            {
                return _pageSize;
            }
            set
            {
                _pageSize = value > maxPageSize ? maxPageSize : value;
            }
        }
    }
}
