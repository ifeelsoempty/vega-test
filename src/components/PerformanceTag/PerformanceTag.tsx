import { FC } from "react"
import { Tag } from "antd"

import { formatPrice } from "utils/formatePrice/formatPrice"

type PerformanceTagProps = {
  percent: number,
  number: number,
}

const getColor = (price: number) => {
  if(price > 0) {
    return 'success';
  }

  if(price < 0) {
    return 'error';
  }

  return 'default'
}

export const PerformanceTag: FC<PerformanceTagProps> = ({ percent, number }) => {
  const color = getColor(number);
  const formattedNumber = formatPrice(number, { withSign: true });
  const formattedPercent = Math.abs(percent).toFixed(2);

  return (
    <Tag color={color}>
      {formattedNumber} · {formattedPercent}%
    </Tag>
  )
}
