import React from 'react';
import { UserList } from '@/types/team/userList';
import Checkbox from '@/components/Primitives/Inputs/Checkboxes/Checkbox/Checkbox';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';

export type UserCheckboxProps = {
  user: UserList;
  disabled: boolean;
  handleChecked: (id: string) => void;
};

const UserCheckbox = ({ user, disabled, handleChecked }: UserCheckboxProps) => (
  <Flex key={user._id} align="center" data-testid="checkboxUserItem">
    <Flex css={{ flex: 1 }}>
      <Checkbox
        id={user._id}
        checked={user.isChecked}
        handleChange={() => {
          handleChecked(user._id);
        }}
        disabled={disabled}
        label={`${user.firstName} ${user.lastName}`}
        size="md"
      />
    </Flex>
    <Flex css={{ flex: 1 }}>
      <Text color="primary300" size="sm">
        {user.email}
      </Text>
    </Flex>
  </Flex>
);

export default UserCheckbox;
