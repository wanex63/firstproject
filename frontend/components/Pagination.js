import { Pagination as MuiPagination, Stack } from '@mui/material';
import { useRouter } from 'next/router';

const Pagination = ({ count, page }) => {
  const router = useRouter();

  const handleChange = (event, value) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: value },
    });
  };

  return (
    <Stack spacing={2} sx={{ mt: 3, mb: 3, alignItems: 'center' }}>
      <MuiPagination
        count={count}
        page={page}
        onChange={handleChange}
        color="primary"
      />
    </Stack>
  );
};

export default Pagination;