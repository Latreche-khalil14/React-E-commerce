import { Card, CardActions, CardContent, Skeleton, Stack } from "@mui/material";

const ProductSkeleton = () => (
  <Card sx={{ maxWidth: 333, mt: 6 }}>
    <Skeleton variant="rectangular" height={277} animation="wave" />
    <CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Skeleton variant="text" width="55%" height={32} animation="wave" />
        <Skeleton variant="text" width="25%" height={28} animation="wave" />
      </Stack>
      <Skeleton variant="text" width="100%" animation="wave" />
      <Skeleton variant="text" width="80%"  animation="wave" />
    </CardContent>
    <CardActions sx={{ px: 2, pb: 2, justifyContent: "space-between" }}>
      <Skeleton variant="rounded" width={130} height={36} animation="wave" />
      <Skeleton variant="text"    width={100} height={24}  animation="wave" />
    </CardActions>
  </Card>
);

export default ProductSkeleton;
