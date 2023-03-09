import React from 'react';
import Text from '@/components/Primitives/Text';
import Tooltip from '@/components/Primitives/Tooltip';
import Button from '@/components/Primitives/Button';
import Icon from '@/components/Primitives/Icon';
import Flex from '@/components/Primitives/Flex';

const NewJoinerTooltip = () => (
  <Flex align="center" gap={8} data-testid="newJoinerTooltip">
    <Text size="sm" fontWeight="medium">
      New Joiner
    </Text>
    <Tooltip content="The new joiner will not be selected as a responsible for the TEAM sub-teams.">
      <Button isIcon>
        <Icon name="info" />
      </Button>
    </Tooltip>
  </Flex>
);

export default NewJoinerTooltip;