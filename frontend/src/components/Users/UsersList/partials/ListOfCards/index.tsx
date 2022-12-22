import React, { useEffect, useMemo, useRef, useState } from 'react';
import Flex from '@/components/Primitives/Flex';
import { UserWithTeams } from '@/types/user/user';
import Text from '@/components/Primitives/Text';
import SearchInput from '@/components/Teams/CreateTeam/ListMembers/SearchInput';
import { useSetRecoilState } from 'recoil';
// import { usersWithTeamsState } from '@/store/user/atoms/user.atom';
import { useInfiniteQuery } from 'react-query';
import { getAllUsersWithTeams } from '@/api/userService';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { toastState } from '@/store/toast/atom/toast.atom';
import LoadingPage from '@/components/loadings/LoadingPage';
import { ScrollableContent } from '../../../../Boards/MyBoards/styles';
import CardBody from '../CardUser/CardBody';

const ListOfCards = React.memo(() => {
  const setToastState = useSetRecoilState(toastState);
  // const setUsersWithTeamsState = useSetRecoilState(usersWithTeamsState);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState<string>('');

  const fetchUsers = useInfiniteQuery(
    'usersWithTeams',
    ({ pageParam = 0 }) => getAllUsersWithTeams(pageParam, search),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => {
        const { hasNextPage, page } = lastPage;
        if (hasNextPage) return page + 1;
        return undefined;
      },
      onError: () => {
        setToastState({
          open: true,
          content: 'Error getting the users',
          type: ToastStateEnum.ERROR,
        });
      },
    },
  );

  const { data, isLoading } = fetchUsers;

  // if (data) {
  //   setUsersWithTeamsState(data?.pages[0].userWithTeams);
  // }

  const users = useMemo(() => {
    const usersArray: UserWithTeams[] = [];
    data?.pages.forEach((page) => {
      page.userWithTeams?.forEach((user) => {
        usersArray.push(user);
      });
    });
    return usersArray;
  }, [data?.pages]);

  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight + 2 >= scrollHeight && fetchUsers.hasNextPage) {
        fetchUsers.fetchNextPage();
      }
    }
  };

  const handleSearchUser = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers.refetch();
    }, 100);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <>
      <Flex>
        <Text css={{ fontWeight: '$bold', flex: 1, mt: '$36' }}>
          {users.length} registered users
        </Text>
        <Flex css={{ width: '460px' }} direction="column" gap={16}>
          <SearchInput
            icon="search"
            iconPosition="left"
            id="search"
            placeholder="Search user"
            currentValue={search}
            handleChange={handleSearchUser}
          />
        </Flex>
      </Flex>
      <ScrollableContent
        direction="column"
        gap="24"
        justify="start"
        css={{ mt: '$24', height: 'calc(100vh - 350px)', overflow: 'auto', pr: '$10' }}
        ref={scrollRef}
        onScroll={onScroll}
      >
        <Flex direction="column">
          {users.map((user: UserWithTeams) => (
            <CardBody key={user.user._id} userWithTeams={user} />
          ))}
        </Flex>

        {isLoading && <LoadingPage />}
      </ScrollableContent>
    </>
  );
});

export default ListOfCards;