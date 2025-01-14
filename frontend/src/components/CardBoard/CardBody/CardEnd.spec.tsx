import React from 'react';
import { libraryMocks } from '@/utils/testing/mocks';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { UserFactory } from '@/utils/factories/user';
import { BoardFactory } from '@/utils/factories/board';
import CardEnd, { CardEndProps } from './CardEnd';

const { mockRouter } = libraryMocks.mockNextRouter({ pathname: '/teams' });

const mockUser = UserFactory.create();

const render = (props: CardEndProps) =>
  renderWithProviders(<CardEnd {...props} />, {
    routerOptions: mockRouter,
    sessionOptions: { user: mockUser },
  });

describe('Components/CardBoard/CardBody/CardEnd', () => {
  it('should render a duplicate board button', () => {
    // Arrange
    const cardEndProps: CardEndProps = {
      board: BoardFactory.create(),
      isDashboard: false,
      isSubBoard: false,
      index: undefined,
      havePermissions: true,
      userId: mockUser._id,
      userIsParticipating: true,
    };

    // Act
    const { getByTestId } = render(cardEndProps);

    // Assert
    expect(getByTestId('duplicateBoardTrigger')).toBeInTheDocument();
  });
});
