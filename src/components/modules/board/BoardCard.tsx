import { Icon, IconNames } from "@/components/base/Icon";
import { Typography } from "@/components/base/Typography";
import { Heading } from "@/components/ui/Heading";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardProps,
  Divider,
} from "@nextui-org/react";
import Link from "next/link";
import { useMemo, type FC } from "react";

type Props = {
  icon?: IconNames;
  title: string;
  description?: string;
  href: string;
  columns: number;
  tasks: number;
};

export type BoardCardProps = CardProps & Props;

export const BoardCard: FC<BoardCardProps> = (props) => {
  const {
    title,
    description,
    columns,
    tasks,
    href,
    icon = "Grid2X2",
    ...rest
  } = props;

  const statistic = useMemo<
    { value: string; icon: IconNames; label: string }[]
  >(() => {
    return [
      {
        value: columns.toString(),
        icon: "Columns",
        label: `Columns count ${columns}`,
      },
      { value: tasks.toString(), icon: "Tags", label: `Tasks count ${tasks}` },
    ];
  }, [columns, tasks]);

  return (
    <Card as="article" {...rest}>
      <CardHeader className="flex gap-3">
        <Icon name={icon} size={32} />
        <Heading title={{ text: title, tag: "h3", styling: "md" }} />
      </CardHeader>
      <Divider />
      <CardBody>
        <Typography
          tag={description ? "p" : "small"}
          styling={description ? undefined : "xs"}
          color={description ? undefined : "default-500"}
        >
          {description ? description : "No description provided..."}
        </Typography>
      </CardBody>
      <Divider />
      <CardFooter className="flex items-center gap-3 flex-wrap justify-between">
        <ul
          aria-label="board statistic"
          className="flex items-center gap-3 flex-wrap"
        >
          {statistic.map((item) => (
            <li key={item.icon} className="flex items-center gap-1">
              <Icon name={item.icon} size={14} />
              <Typography tag="span" styling="xs">
                {item.value}
              </Typography>
            </li>
          ))}
        </ul>
        <Link
          href={href}
          className="flex items-center gap-3 hover:text-primary"
        >
          See more <Icon name="MoveRight" />
        </Link>
      </CardFooter>
    </Card>
  );
};
