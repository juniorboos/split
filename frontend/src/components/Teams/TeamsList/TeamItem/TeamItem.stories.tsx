import { useSession } from 'next-auth/react';

import TeamItem from '@/components/Teams/TeamsList/TeamItem/TeamItem';
import { TeamFactory } from '@/utils/factories/team';
import { ComponentStory } from '@storybook/react';

import { createTeamUser } from '@/stories/utils/createTeamUser';

export default {
  title: 'Teams/TeamItem',
  component: TeamItem,
  parameters: {
    layout: 'padded',
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
    nextRouter: {
      pathname: '/teams',
      query: {},
    },
  },
  args: {
    team: TeamFactory.create(),
  },
  argTypes: {
    team: {
      type: { required: true },
      description: 'Team to be displayed',
      table: {
        type: { summary: 'Team' },
      },
    },
  },
};

const Template: ComponentStory<typeof TeamItem> = ({ team }) => {
  const { data: session } = useSession();
  const user: any = session?.user!;

  if (user.isMember) {
    createTeamUser(user, team);
  }

  return <TeamItem team={team} userId={user.id} isSAdmin={user.isSAdmin} />;
};

export const Default = Template.bind({});
Default.storyName = 'Team Page';

export const UserPage = Template.bind({});
UserPage.storyName = 'User Page';
UserPage.parameters = {
  nextRouter: {
    pathname: '/users',
    query: {
      userId: '420',
    },
  },
};
