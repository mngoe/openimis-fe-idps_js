import React, { useCallback, useState } from "react";
import { useReportsQuery } from "../hooks";
import { Searcher, useTranslations, useModulesManager } from "@openimis/fe-core";
import GenerateReportPicker from "./GenerateReportPicker";
import { Box, Button } from "@material-ui/core";
import ReportDefinitionEditorDialog from "./ReportDefinitionEditorDialog";

const HEADERS = ["idps.report.description", "idps.report.module", "idps.report.name" , ""];

const ReportSearcher = () => {
  const modulesManager = useModulesManager();
  const { formatMessageWithValues, formatMessage } = useTranslations("idps", modulesManager);
  const { data, isLoading, error, refetch } = useReportsQuery();
  const [editedReport, setEditedReport] = useState();
  const itemFormatters = useCallback(
    () => [
      (r) => r.description,
      (r) => r.module,
      (r) => r.name,
      (r) => (
        <Box display="flex" justifyContent={"flex-end"} gridGap={12}>
          <Button onClick={() => setEditedReport(r)} size="small">
            {formatMessage("ReportSearcher.editBtn")}
          </Button>
          { <GenerateReportPicker name={r.name} /> }
        </Box>
      ),
    ],
    []
  );

  return (
    <>
      <Searcher
        module="idps"
        tableTitle={formatMessageWithValues("ReportSearcher.tableTitle", { count: data?.reports?.length })}
        items={data?.reports.filter( report => report.module == 'idps') ?? []}
        fetchingItems={isLoading}
        errorItems={error}
        fetch={() => refetch()}
        itemsPageInfo={{ totalCount: data?.reports?.length ?? 0 }}
        headers={() => HEADERS}
        itemFormatters={itemFormatters}
        withPagination={false}
      />
      {editedReport && <ReportDefinitionEditorDialog name={editedReport.name} onClose={() => setEditedReport(null)} />}
    </>
  );
};

export default ReportSearcher;
