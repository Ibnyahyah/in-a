import {
  Box,
  Button,
  Card,
  createStyles,
  FileInput,
  Flex,
  Input,
  MultiSelect,
  SimpleGrid,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertTriangle, IconUpload } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

export interface CampaignValues {
  csv: File | null;
  sender_name: string;
  sender_email: string;
  open_rate: number;
  bounce_rate: number;
  unsubscribe: number;
  email_sent: number;
  subject: string;
  inbox_rate: number;
  country: string[];
  source_of_traffic: string[];
  browser_type: string[];
}

const useStyles = createStyles((theme) => ({
  invalid: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.fn.rgba(theme.colors.red[8], 0.15)
        : theme.colors.red[0],
  },

  icon: {
    color: theme.colors.red[theme.colorScheme === "dark" ? 7 : 6],
  },
}));

type CreateCampaignProps = {
  submitHandler: any;
  row_of_csv: (csv_row: number) => void;
  csv_file: (file: File | null) => void;
  loading: boolean;
  title: string;
  formValues: CampaignValues;
  trafficData?: string[];
  browserData?: string[];
  countryData?: string[];
  csv_rows?: number;
};

const CreateCampaign: React.FC<CreateCampaignProps> = ({
  submitHandler,
  row_of_csv,
  loading,
  title,
  formValues,
  csv_file,
  trafficData,
  browserData,
  countryData,
  csv_rows,
}) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvRows, setCsvRows] = useState(csv_rows ? csv_rows : 0);
  const [country, setCountry] = useState<string[]>(
    countryData ? countryData : []
  );
  const [browserType, setBrowserType] = useState<string[]>(
    browserData ? browserData : []
  );
  const [sourceOfTraffic, setSourceOfTraffic] = useState<string[]>(
    trafficData ? trafficData : []
  );

  const { classes } = useStyles();

  const form = useForm<CampaignValues>({
    initialValues: formValues,
  });

  form.values.country = country;
  form.values.browser_type = browserType;
  form.values.source_of_traffic = sourceOfTraffic;

  const readCSV = async (file: any) => {
    if (file === null) return;
    const reader = new FileReader();

    reader.onload = function (e) {
      const csvString = e.target?.result as string;
      const rows = csvString.split("\n");
      const numRows = rows.length;
      setCsvRows(numRows);
    };

    reader.readAsText(file);
  };

  useEffect(() => {
    readCSV(csvFile);
  }, [csvFile]);

  useEffect(() => {
    row_of_csv(csvRows);
  }, [csvRows, row_of_csv]);

  useEffect(() => {
    csv_file(csvFile);
  }, [csvFile, csv_file]);

  function isInvalid(name: string) {
    if (name.length < 4) return true;
  }

  function numberIsInvalid(number: number) {
    if (number < 0) return true;
  }

  function multiInputIsValid(name: string[]) {
    if (name.length === 0) return true;
  }

  return (
    <Box>
      <h1 className="mb-4 text-[20px] md:text-[2em]">{title}:</h1>
      <Card p="xl" withBorder radius="md" className="bg-[#fafafa]">
        <Card.Section p="xl">
          <form
            onSubmit={form.onSubmit((values) => {
              submitHandler(values);
            })}
          >
            <SimpleGrid
              cols={1}
              breakpoints={[
                { minWidth: 768, cols: 2, spacing: "md" },
                { minWidth: 1024, cols: 3, spacing: "md" },
              ]}
            >
              <Input.Wrapper label="Upload CSV File">
                <FileInput
                  required
                  accept=".csv"
                  placeholder="upload CSV"
                  icon={<IconUpload size={14} />}
                  value={form.values.csv}
                  onChange={(files) => {
                    if (files) {
                      setCsvFile(files);
                      form.setFieldValue("csv", files);
                    }
                  }}
                />
              </Input.Wrapper>

              <Input.Wrapper label="Sender Name">
                <Input
                  invalid={isInvalid(form.values.sender_name)}
                  rightSection={
                    isInvalid(form.values.sender_name) && (
                      <IconAlertTriangle
                        stroke={1.5}
                        size="1.1rem"
                        className={classes.icon}
                      />
                    )
                  }
                  required
                  value={form.values.sender_name}
                  onChange={(event) =>
                    form.setFieldValue("sender_name", event.currentTarget.value)
                  }
                />
              </Input.Wrapper>

              <Input.Wrapper label="Sender Email">
                <Input
                  type="email"
                  placeholder="Your email"
                  invalid={!form.values.sender_email.includes("@")}
                  required
                  value={form.values.sender_email}
                  onChange={(event) =>
                    form.setFieldValue(
                      "sender_email",
                      event.currentTarget.value
                    )
                  }
                />
              </Input.Wrapper>

              <Input.Wrapper label="Subject">
                <Input
                  invalid={isInvalid(form.values.subject)}
                  rightSection={
                    isInvalid(form.values.subject) && (
                      <IconAlertTriangle
                        stroke={1.5}
                        size="1.1rem"
                        className={classes.icon}
                      />
                    )
                  }
                  required
                  value={form.values.subject}
                  onChange={(event) =>
                    form.setFieldValue("subject", event.currentTarget.value)
                  }
                />
              </Input.Wrapper>

              <Input.Wrapper label="Open rate">
                <Input
                  type="number"
                  invalid={numberIsInvalid(+form.values.open_rate)}
                  rightSection={
                    numberIsInvalid(+form.values.open_rate) && (
                      <IconAlertTriangle
                        stroke={1.5}
                        size="1.1rem"
                        className={classes.icon}
                      />
                    )
                  }
                  required
                  value={form.values.open_rate}
                  onChange={(event) =>
                    form.setFieldValue("open_rate", +event.currentTarget.value)
                  }
                />
              </Input.Wrapper>

              <Input.Wrapper label="Bounce Rate">
                <Input
                  type="number"
                  invalid={numberIsInvalid(+form.values.bounce_rate)}
                  rightSection={
                    numberIsInvalid(+form.values.bounce_rate) && (
                      <IconAlertTriangle
                        stroke={1.5}
                        size="1.1rem"
                        className={classes.icon}
                      />
                    )
                  }
                  required
                  value={form.values.bounce_rate}
                  onChange={(event) =>
                    form.setFieldValue(
                      "bounce_rate",
                      +event.currentTarget.value
                    )
                  }
                />
              </Input.Wrapper>

              <Input.Wrapper label="Unsubscribed">
                <Input
                  type="number"
                  invalid={numberIsInvalid(+form.values.unsubscribe)}
                  rightSection={
                    numberIsInvalid(+form.values.unsubscribe) && (
                      <IconAlertTriangle
                        stroke={1.5}
                        size="1.1rem"
                        className={classes.icon}
                      />
                    )
                  }
                  required
                  value={form.values.unsubscribe}
                  onChange={(event) =>
                    form.setFieldValue(
                      "unsubscribe",
                      +event.currentTarget.value
                    )
                  }
                />
              </Input.Wrapper>

              <Input.Wrapper label="Email Sent">
                <Input
                  type="number"
                  invalid={numberIsInvalid(+form.values.email_sent)}
                  rightSection={
                    numberIsInvalid(+form.values.email_sent) && (
                      <IconAlertTriangle
                        stroke={1.5}
                        size="1.1rem"
                        className={classes.icon}
                      />
                    )
                  }
                  required
                  value={form.values.email_sent}
                  onChange={(event) =>
                    form.setFieldValue("email_sent", +event.currentTarget.value)
                  }
                />
              </Input.Wrapper>

              <Input.Wrapper label="Inbox rate">
                <Input
                  type="number"
                  invalid={numberIsInvalid(+form.values.inbox_rate)}
                  rightSection={
                    numberIsInvalid(+form.values.inbox_rate) && (
                      <IconAlertTriangle
                        stroke={1.5}
                        size="1.1rem"
                        className={classes.icon}
                      />
                    )
                  }
                  required
                  placeholder="Enter Inbox rate"
                  value={form.values.inbox_rate}
                  onChange={(event) =>
                    form.setFieldValue("inbox_rate", +event.currentTarget.value)
                  }
                />
              </Input.Wrapper>

              <MultiSelect
                label="Source of traffic"
                data={sourceOfTraffic}
                placeholder="Add items"
                creatable
                searchable
                getCreateLabel={(query) => `+ Create ${query}`}
                onCreate={(query) => {
                  const item = { value: query, label: query };
                  setSourceOfTraffic((current) => [...current, item.value]);
                  return item;
                }}
                onChange={setSourceOfTraffic}
                error={multiInputIsValid(form.values.source_of_traffic)}
                rightSection={
                  multiInputIsValid(form.values.source_of_traffic) && (
                    <IconAlertTriangle
                      stroke={1.5}
                      size="1.1rem"
                      className={classes.icon}
                    />
                  )
                }
                required
                withAsterisk={false}
              />

              <MultiSelect
                required
                label="Device Type"
                data={browserType}
                placeholder="Add items"
                creatable
                searchable
                getCreateLabel={(query) => `+ Create ${query}`}
                onCreate={(query) => {
                  const item = { value: query, label: query };
                  setBrowserType((current) => [...current, item.value]);
                  return item;
                }}
                onChange={setBrowserType}
                error={multiInputIsValid(form.values.browser_type)}
                rightSection={
                  multiInputIsValid(form.values.browser_type) && (
                    <IconAlertTriangle
                      stroke={1.5}
                      size="1.1rem"
                      className={classes.icon}
                    />
                  )
                }
                withAsterisk={false}
              />

              <MultiSelect
                label="Country"
                data={country}
                placeholder="Add items"
                creatable
                searchable
                getCreateLabel={(query) => `+ Create ${query}`}
                onCreate={(query) => {
                  const item = { value: query, label: query };
                  setCountry((current) => [...current, item.value]);
                  return item;
                }}
                onChange={setCountry}
                error={multiInputIsValid(form.values.country)}
                rightSection={
                  multiInputIsValid(form.values.country) && (
                    <IconAlertTriangle
                      stroke={1.5}
                      size="1.1rem"
                      className={classes.icon}
                    />
                  )
                }
                required
                withAsterisk={false}
              />
            </SimpleGrid>

            <Flex mt={20}>
              <Button
                loading={loading}
                type="submit"
                className="bg-[#228be6] text-[#fff] opacity-100 hover:opacity-80 hover:bg-[#228be6]"
              >
                Generate Campaign Report
              </Button>
            </Flex>
          </form>
        </Card.Section>
      </Card>
    </Box>
  );
};
export default CreateCampaign;
