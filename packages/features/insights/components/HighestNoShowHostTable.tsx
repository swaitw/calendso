import { Title } from "@tremor/react";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc";

import { useInsightsParameters } from "../hooks/useInsightsParameters";
import { CardInsights } from "./Card";
import { LoadingInsight } from "./LoadingInsights";
import { TotalUserFeedbackTable } from "./TotalUserFeedbackTable";

export const HighestNoShowHostTable = () => {
  const { t } = useLocale();
  const { isAll, teamId, startDate, endDate, eventTypeId } = useInsightsParameters();

  const { data, isSuccess, isPending } = trpc.viewer.insights.membersWithMostNoShow.useQuery(
    {
      startDate,
      endDate,
      teamId,
      eventTypeId,
      isAll,
    },
    {
      staleTime: 30000,
      trpc: {
        context: { skipBatch: true },
      },
    }
  );

  if (isPending) return <LoadingInsight />;

  if (!isSuccess || !data) return null;

  return data && data.length > 0 ? (
    <CardInsights className="shadow-none">
      <Title className="text-emphasis">{t("most_no_show_host")}</Title>
      <TotalUserFeedbackTable data={data} />
    </CardInsights>
  ) : (
    <></>
  );
};
