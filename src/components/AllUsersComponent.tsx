import {
  Center,
  createStyles,
  Group,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import {
  IconChevronDown,
  IconChevronUp,
  IconDots,
  IconSearch,
  IconSelector,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: "3rem",
    height: "3.5rem",
    borderRadius: "3rem",
  },
}));

export interface AllUsersRowData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  role: string;
}

interface ThProps {
  children?: React.ReactNode;
  reversed?: boolean;
  sorted?: boolean;
  onSort?(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text fw={500} fz="sm">
            {children}
          </Text>

          {children === undefined ? (
            ""
          ) : (
            <Center className={classes.icon}>
              <Icon size="0.9rem" stroke={1.5} />
            </Center>
          )}
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data: AllUsersRowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
  );
}

function sortData(
  data: AllUsersRowData[],
  payload: {
    sortBy: keyof AllUsersRowData | null;
    reversed: boolean;
    search: string;
  }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}

type AllUsersComponentProps = {
  data: AllUsersRowData[];
};

const AllUsersComponent: React.FC<AllUsersComponentProps> = ({ data }) => {
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof AllUsersRowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof AllUsersRowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    );
  };

  const router = useRouter();

  const rows = sortedData?.map((row) => (
    <tr key={row.id}>
      <td>{row.first_name}</td>
      <td>{row.last_name}</td>
      <td>{row.username}</td>
      <td>{row.email}</td>
      <td>{row.role}</td>
      <td onClick={() => router.push(`all-users/${row.id}`)}>
        <IconDots size="0.9rem" stroke={1.5} className="cursor-pointer" />
      </td>
    </tr>
  ));

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        icon={<IconSearch size="0.9rem" stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table horizontalSpacing="md" verticalSpacing="xs" miw={700}>
        <thead>
          <tr>
            <Th
              sorted={sortBy === "first_name"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("first_name")}
            >
              First Name
            </Th>
            <Th
              sorted={sortBy === "last_name"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("last_name")}
            >
              Last Name
            </Th>
            <Th
              sorted={sortBy === "username"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("username")}
            >
              Username
            </Th>
            <Th
              sorted={sortBy === "email"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("email")}
            >
              Email
            </Th>
            <Th
              sorted={sortBy === "role"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("role")}
            >
              Role
            </Th>
            <Th reversed={reverseSortDirection}></Th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan={5}>
                <Text weight={500} align="center" className="mt-4">
                  Nothing found
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </ScrollArea>
  );
};

export default AllUsersComponent;
