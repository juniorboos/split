import SearchInput from '@/components/Primitives/Inputs/SearchInput/SearchInput';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';

export type UsersSubHeaderProps = {
  userAmount: number | undefined;
  search: string;
  handleSearchUser: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearSearch: () => void;
};

const UsersSubHeader = ({
  userAmount,
  search,
  handleSearchUser,
  handleClearSearch,
}: UsersSubHeaderProps) => (
  <Flex css={{ mt: '$16' }} justify="between" align="end">
    <Text fontWeight="bold">{userAmount} registered users</Text>
    <Flex css={{ width: '$455' }}>
      <SearchInput
        placeholder="Search user"
        currentValue={search}
        handleChange={handleSearchUser}
        handleClear={handleClearSearch}
      />
    </Flex>
  </Flex>
);

export default UsersSubHeader;
