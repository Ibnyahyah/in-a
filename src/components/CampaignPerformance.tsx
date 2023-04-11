import { useState } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  Checkbox,
  Button,
  Pagination,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconDownload,
  IconPencil,
  IconPlayerPause,
  IconPlayerPlay,
  IconDots,
  IconPlus,
} from "@tabler/icons-react";
import { useRouter } from "next/router";

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
    width: "4rem",
    height: "4rem",
    borderRadius: "4rem",
  },

  rowSelected: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0],
  },
}));

export interface campaignRowData {
  id: string;
  email_sent: { rate: number; percentage: number };
  subject: string;
  inbox_rate: { rate: number; percentage: number };
  open_rate: { rate: number; percentage: number };
  bounce_rate: { rate: number; percentage: number };
  date: string;
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

function filterData(data: campaignRowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) =>
      item[key].toString().toLowerCase().includes(query)
    )
  );
}

function sortData(
  data: campaignRowData[],
  payload: {
    sortBy: keyof campaignRowData | null;
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
        return b[sortBy].toString().localeCompare(a[sortBy].toString());
      }

      return a[sortBy].toString().localeCompare(b[sortBy].toString());
    }),
    payload.search
  );
}

type CampaignPerformanceProps = {
  data: campaignRowData[];
};

const CampaignPerformance: React.FC<CampaignPerformanceProps> = ({ data }) => {
  const { classes, cx } = useStyles();
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof campaignRowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const router = useRouter();

  const setSorting = (field: keyof campaignRowData) => {
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

  const [selection, setSelection] = useState(["1"]);
  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current) =>
      current.length === data.length ? [] : data.map((item) => item.id)
    );

  const rows = sortedData.map((row) => {
    const selected = selection.includes(row.id);
    return (
      <tr key={row.id} className={cx({ [classes.rowSelected]: selected })}>
        <td>
          <Checkbox
            checked={selection.includes(row.id)}
            onChange={() => toggleRow(row.id)}
            transitionDuration={0}
          />
        </td>

        <td>{row.subject}</td>
        <td>{row.id}</td>
        <td>{row.date}</td>
        <td>{row.email_sent.rate}</td>
        <td>{row.inbox_rate.percentage.toFixed(2)}</td>
        <td>{row.open_rate.percentage.toFixed(2)}</td>
        <td>{row.bounce_rate.percentage.toFixed(2)}</td>
        <td onClick={() => router.push(`all-campaigns/${row.id}`)}>
          <IconDots size="0.9rem" stroke={1.5} className="cursor-pointer" />
        </td>
      </tr>
    );
  });

  return (
    <>
      <h3 className="font-bold text-[20px] mb-5">Campaign performance</h3>
      <ScrollArea>
        <div className="flex justify-between gap-[2rem]">
          <TextInput
            className="w-[30%]"
            placeholder="Search by any field"
            mb="md"
            icon={<IconSearch size="0.9rem" stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
          />

          <div>
            <Button
              leftIcon={<IconPlus size={14} />}
              className="bg-[#223be2] text-[#fff] opacity-100 hover:opacity-80 hover:bg-[#228be6] mr-5"
              onClick={() => router.push("/create-campaign")}
            >
              Add Campaign
            </Button>
            <Button
              leftIcon={<IconDownload size={14} />}
              className="bg-[#228be6] text-[#fff] opacity-100 hover:opacity-80 hover:bg-[#228be6]"
            >
              Export
            </Button>
          </div>
        </div>
        <div className="table-container">
          <Table horizontalSpacing="md" verticalSpacing="xs">
            <thead>
              <tr>
                <th style={{ width: "4rem", paddingLeft: "0" }}>
                  <Checkbox
                    onChange={toggleAll}
                    checked={selection.length === data.length}
                    indeterminate={
                      selection.length > 0 && selection.length !== data.length
                    }
                    transitionDuration={0}
                  />
                </th>

                <Th
                  sorted={sortBy === "subject"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("subject")}
                >
                  Subject
                </Th>
                <Th
                  sorted={sortBy === "id"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("id")}
                >
                  Id
                </Th>
                <Th
                  sorted={sortBy === "date"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("date")}
                >
                  Date
                </Th>

                <Th
                  sorted={sortBy === "email_sent"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("email_sent")}
                >
                  Email S.
                </Th>
                <Th
                  sorted={sortBy === "inbox_rate"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("inbox_rate")}
                >
                  Inbox R.
                </Th>
                <Th
                  sorted={sortBy === "open_rate"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("open_rate")}
                >
                  Open R.
                </Th>
                <Th
                  sorted={sortBy === "bounce_rate"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("bounce_rate")}
                >
                  Bounce R.
                </Th>
                <Th reversed={reverseSortDirection}></Th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows
              ) : (
                <tr>
                  <td colSpan={10}>
                    <Text weight={500} align="center">
                      Nothing found
                    </Text>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </ScrollArea>
    </>
  );
};

export default CampaignPerformance;
