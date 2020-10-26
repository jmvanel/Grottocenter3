import { useIntl } from 'react-intl';
import { propOr, map, pipe, join, head, isNil, reject, isEmpty } from 'ramda';

const makeCustomCellRenders = () => {
  const { formatDate, formatMessage } = useIntl();
  return [
    {
      id: 'dateInscription',
      customRender: (date) => formatDate(new Date(date)),
    },
    {
      id: 'datePublication',
      customRender: (date) => formatDate(new Date(date)),
    },
    {
      id: 'dateValidation',
      customRender: (date) => formatDate(new Date(date)),
    },
    {
      id: 'authors',
      customRender: pipe(
        map(propOr('', 'nickname')),
        reject(isEmpty),
        join(' - '),
      ),
    },
    {
      id: 'author',
      customRender: propOr('', 'name'),
    },
    {
      id: 'identifierType',
      customRender: propOr('', 'text'),
    },
    {
      id: 'license',
      customRender: propOr('', 'text'),
    },
    {
      id: 'regions',
      customRender: pipe(map(propOr('', 'name')), reject(isEmpty), join(' - ')),
    },
    {
      id: 'subjects',
      customRender: pipe(map(propOr('', 'name')), reject(isEmpty), join(' - ')),
    },
    {
      id: 'library',
      customRender: propOr('', 'address'),
    },
    {
      id: 'type',
      customRender: propOr('', 'name'),
    },
    {
      id: 'entrance',
      customRender: (entrance) =>
        `${formatMessage({ id: 'City' })}: ${propOr('', 'city', entrance)}`,
    },
    {
      id: 'descriptions',
      customRender: pipe(head, propOr('', 'title')),
    },
    {
      id: 'parent',
      customRender: (parent) =>
        !isNil(parent) &&
        !isNil(parent.refBbs) &&
        `${formatMessage({ id: 'BBS Reference' })}: ${propOr(
          '',
          'refBbs',
          parent,
        )}`,
    },
  ];
};

export default makeCustomCellRenders;