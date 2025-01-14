import React, { useEffect, useMemo, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { styled } from '@/styles/stitches/stitches.config';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { cardBlur } from '@/helper/board/blurFilter';
import { getCommentsFromCardGroup } from '@/helper/board/comments';
import { BoardUser } from '@/types/board/board.user';
import CardType from '@/types/card/card';
import { onDragCardStart } from '@/store/card/atoms/card.atom';
import { useRecoilValue } from 'recoil';
import { BoardPhases } from '@/utils/enums/board.phases';
import useCards from '@/hooks/useCards';
import AddCardOrComment from '../AddCardOrComment';
import Comments from '../Comment/Comments';
import CardFooter from './CardFooter';
import CardItemList from './CardItem/CardItemList';
import PopoverCardSettings from './PopoverSettings';

const Container = styled(Flex, {
  borderRadius: '$8',
  p: '$16',
  wordBreak: 'breakWord',
});

interface CardBoardProps {
  color: string;
  card: CardType;
  index: number;
  colId: string;
  userId: string;
  boardId: string;
  socketId: string;
  isMainboard: boolean;
  boardUser?: BoardUser;
  cardTextDefault?: string;
  maxVotes?: number;
  isSubmited: boolean;
  hideCards: boolean;
  isDefaultText: boolean;
  cardText?: string;
  hasAdminRole: boolean;
  postAnonymously: boolean;
  isRegularBoard?: boolean;
  phase?: string;
}

const CardBoard = React.memo<CardBoardProps>(
  ({
    card,
    index,
    color,
    boardId,
    socketId,
    userId,
    colId,
    isMainboard,
    boardUser,
    maxVotes,
    isSubmited,
    hideCards,
    isDefaultText,
    hasAdminRole,
    postAnonymously,
    isRegularBoard,
    cardTextDefault,
    phase,
  }) => {
    const { deleteCard } = useCards();

    const isCardGroup = card.items.length > 1;
    const comments = useMemo(
      () =>
        [
          ...(card.items.length === 1 ? card.items[0].comments : getCommentsFromCardGroup(card)),
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      [card],
    );

    const draggedCard = useRecoilValue(onDragCardStart);
    const [isCommentsOpened, setOpenComments] = useState(false);
    const [editing, setEditing] = useState(false);

    const createdBy = useMemo(() => {
      if (Object.hasOwnProperty.call(card, 'items')) {
        const cardTyped = card as CardType;
        return cardTyped.items[cardTyped.items.length - 1].createdBy;
      }
      return card.createdBy;
    }, [card]);

    const handleOpenComments = () => {
      if (hideCards && createdBy?._id !== userId) return;
      setOpenComments(!isCommentsOpened);
    };

    const handleEditing = () => {
      setEditing(!editing);
    };

    const handleDelete = () => {
      deleteCard.mutate({
        boardId,
        cardId: card._id,
        socketId,
        columnId: colId,
        userId,
        isCardGroup: true,
        cardItemId: card._id,
      });
    };

    useEffect(() => {
      if (card._id === draggedCard || hideCards) {
        setOpenComments(false);
      }
    }, [card._id, draggedCard, hideCards]);

    return (
      <Draggable
        key={card._id}
        draggableId={card._id}
        index={index}
        isDragDisabled={
          isSubmited ||
          (isMainboard && !hasAdminRole) ||
          (isMainboard && hideCards) ||
          phase === BoardPhases.SUBMITTED
        }
      >
        {(provided) => (
          <Flex
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            direction="column"
            css={{
              userSelect: hideCards && card.createdBy?._id !== userId ? 'none' : 'auto',
              backgroundColor: color,
              borderRadius: '$8',
              mb: '$12',
              pointerEvents: hideCards && card.createdBy?._id !== userId ? 'none' : 'auto',
            }}
          >
            <Container
              direction="column"
              css={{
                cursor: 'grab',
                backgroundColor: color,
                py: !isCardGroup ? '$16' : '$8',
                mb: isCardGroup ? '$12' : 'none',
                filter: cardBlur(hideCards, card as CardType, userId),
                transform: 'translate3d(0.1, 0.1, 0.1)',
              }}
            >
              {editing && !isSubmited && (
                <AddCardOrComment
                  isCard
                  isEditing
                  isUpdate
                  boardId={boardId}
                  cancelUpdate={handleEditing}
                  cardId={card._id}
                  cardItemId={card.items[0]._id}
                  cardText={card.text}
                  cardTextDefault={cardTextDefault}
                  colId={colId}
                  socketId={socketId}
                  anonymous={card.anonymous}
                  isDefaultText={isDefaultText}
                  postAnonymously={postAnonymously}
                />
              )}
              {!editing && (
                <Flex direction="column">
                  {isCardGroup && (
                    <Flex css={{ py: '$8' }} justify="between">
                      <Flex align="center" gap="4">
                        <Icon css={{ width: '$14', height: '$14' }} name="merge" />
                        <Text size="xxs" fontWeight="medium">
                          {card.items.length} merged cards
                        </Text>
                      </Flex>
                    </Flex>
                  )}
                  {!isCardGroup && (
                    <Flex
                      css={{
                        mb: '$14',
                        '& > div': { zIndex: 2 },
                      }}
                      justify="between"
                    >
                      <Text
                        size="md"
                        css={{
                          wordBreak: 'break-word',
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {card.text}
                      </Text>
                      {!isSubmited &&
                        phase !== BoardPhases.SUBMITTED &&
                        ((userId === card?.createdBy?._id && !isMainboard) || hasAdminRole) && (
                          <PopoverCardSettings
                            boardId={boardId}
                            cardGroupId={card._id}
                            columnId={colId}
                            firstOne={false}
                            handleDelete={handleDelete}
                            handleEditing={handleEditing}
                            hideCards={hideCards}
                            isItem={false}
                            item={card}
                            itemId={card.items[0]._id}
                            newPosition={0}
                            socketId={socketId}
                            userId={userId}
                            hasAdminRole={hasAdminRole}
                          />
                        )}
                    </Flex>
                  )}
                  {card.items && isCardGroup && (
                    <CardItemList
                      boardId={boardId}
                      cardGroupId={card._id}
                      cardGroupPosition={index}
                      color={color}
                      columnId={colId}
                      hideCards={hideCards}
                      isMainboard={isMainboard}
                      isSubmited={isSubmited}
                      items={card.items}
                      socketId={socketId}
                      userId={userId}
                      isDefaultText={isDefaultText}
                      hasAdminRole={hasAdminRole}
                      postAnonymously={postAnonymously}
                      cardTextDefault={cardTextDefault}
                    />
                  )}
                  <CardFooter
                    anonymous={card.items[card.items.length - 1 || 0].anonymous}
                    boardId={boardId}
                    boardUser={boardUser}
                    card={card}
                    comments={comments}
                    hideCards={hideCards}
                    isCommentsOpened={isCommentsOpened}
                    isItem={false}
                    isMainboard={isMainboard}
                    maxVotes={maxVotes}
                    setOpenComments={handleOpenComments}
                    socketId={socketId}
                    userId={userId}
                    isRegularBoard={isRegularBoard}
                    phase={phase}
                  />
                </Flex>
              )}
            </Container>
            {isCommentsOpened && (
              <Comments
                boardId={boardId}
                cardId={card._id}
                cardItems={card.items}
                comments={comments}
                hideCards={hideCards}
                isSubmited={isSubmited}
                socketId={socketId}
                userId={userId}
                columnId={colId}
                isDefaultText={isDefaultText}
                hasAdminRole={hasAdminRole}
                postAnonymously={postAnonymously}
                isMainboard={isMainboard}
                phase={phase}
              />
            )}
          </Flex>
        )}
      </Draggable>
    );
  },
);

export default CardBoard;
