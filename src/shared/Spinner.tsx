import { Flex, Spin } from "antd";
import { FC } from "react";

export const Spinner: FC = () => (
  <div className="onLoadSpinner">
    <Flex gap="small" vertical>
      <Spin tip="Загрузка...." size="large">
        <div className="content" />
      </Spin>
    </Flex>
  </div>
);
