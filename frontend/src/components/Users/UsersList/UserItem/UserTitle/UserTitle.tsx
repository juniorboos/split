// CHECK: Should add ellipsis to User Name
import Link from 'next/link';

import Text from '@/components/Primitives/Text/Text';
import { User } from '@/types/user/user';
import { ROUTES } from '@/utils/routes';

type UserTitleProps = {
  user: User;
  hasPermissions: boolean;
};

const UserTitle = ({ user, hasPermissions }: UserTitleProps) => {
  const getTitle = () => (
    <Text link={hasPermissions} fontWeight="bold" size="sm" overflow="wrap">
      {user.firstName} {user.lastName}
    </Text>
  );

  if (hasPermissions) {
    return <Link href={ROUTES.UserPage(user._id)}>{getTitle()}</Link>;
  }

  return getTitle();
};

export default UserTitle;
