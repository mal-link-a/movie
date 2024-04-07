import { Flex, Spin } from "antd";
import { FC } from "react";
const Spinner: FC = () => (
  <div className="onLoadSpinner">
    <Flex gap="small" vertical>
      <Spin tip="Загрузка...." size="large">
        <div className="content" />
      </Spin>
    </Flex>
  </div>
);
export { Spinner };
