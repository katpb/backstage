/*
 * Copyright 2021 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Grid } from '@material-ui/core';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import {
  EntityContext,
  CatalogApi,
  catalogApiRef,
} from '@backstage/plugin-catalog-react';
import { ApiProvider, ApiRegistry } from '@backstage/core-api';

import { MembersListCard } from '.';

export default {
  title: 'Plugins/Org/Group Members List Card',
  component: MembersListCard,
};

const makeUser = ({ name, uid, displayName, email }) => ({
  kind: 'User',
  metadata: {
    name,
    uid,
  },
  spec: {
    profile: {
      displayName,
      email,
      picture: `https://avatars.dicebear.com/api/avataaars/${email}.svg?background=%23fff`,
    },
  },
  relations: [
    {
      type: 'memberOf',
      target: {
        namespace: 'default',
        kind: 'group',
        name: 'team-a',
      },
    },
  ],
});

const defaultEntity: GroupEntity = {
  kind: 'Group',
  metadata: {
    name: 'team-a',
    description: 'Team A',
  },
  spec: {
    profile: {
      displayName: 'Team A',
      email: 'team-a@example.com',
      picture:
        'https://avatars.dicebear.com/api/identicon/team-a@example.com.svg?background=%23fff&margin=25',
    },
  },
};

const alice = makeUser({
  name: 'alice',
  uid: '123',
  displayName: 'Alice Doe',
  email: 'alice@example.com',
});
const bob = makeUser({
  name: 'bob',
  uid: '456',
  displayName: 'Bob Jones',
  email: 'bob@example.com',
});

const catalogApi: Partial<CatalogApi> = {
  getEntities: () => Promise.resolve({ items: [alice, bob] }),
};

const apiRegistry = ApiRegistry.from([[catalogApiRef, catalogApi]]);

export const Default = () => (
  <MemoryRouter>
    <ApiProvider apis={apiRegistry}>
      <EntityContext.Provider value={{ entity: defaultEntity, loading: false }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <MembersListCard />
          </Grid>
        </Grid>
      </EntityContext.Provider>
    </ApiProvider>
  </MemoryRouter>
);
