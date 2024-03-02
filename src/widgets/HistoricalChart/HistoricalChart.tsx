import { FC, useMemo } from "react"

import { Balance } from "./components/Balance";

import styles from './HistoricalChart.module.css'
import { Table, TableProps, Tag } from "antd";
import { useSelector } from "react-redux";
import { selectAssetPriceDifference, selectPortfolio } from "store/slices/portfolio/selectors";
import { formatPrice } from "utils/formatPrice";
import { PriceDifference } from "store/slices/portfolio/types";
import { PerformanceTag } from "components/PerformanceTag";

type DataType = {
  key: number,
  name: string,
  quantity: number,
  price: string,
  totalPrice: string,
  priceDifference: PriceDifference
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <Tag>{text}</Tag>,
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity'
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price'
  },
  {
    title: 'Total price',
    dataIndex: 'totalPrice',
    key: 'totalPrice',
    render: (text: string) => <b>{text}</b>,
  },
  {
    title: 'Performance',
    dataIndex: 'priceDifference',
    key: 'performance',
    align: 'right',
    render: (priceDifference: PriceDifference) => {
      if(!priceDifference.number) return null

      return <PerformanceTag number={priceDifference.number} percent={priceDifference.percent}/>
    },
  }
]

export const HistoricalChart: FC = () => {
  const { data: portfolio } = useSelector(selectPortfolio);
  const assetPriceDifference = useSelector(selectAssetPriceDifference);

  const dataSource = useMemo<DataType[] | undefined>(() => {
    return portfolio?.positions.map((position) => ({
      key: position.id,
      name: position.asset.name,
      quantity: position.quantity,
      price: formatPrice(position.asset.price),
      totalPrice: formatPrice(position.price),
      priceDifference: assetPriceDifference[position.asset.name]
    }))
  }, [portfolio, assetPriceDifference])

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.title}>Overall Performance</h2>
        <span className={styles.startDate}>For the whole time</span>
      </div>
      <Balance className={styles.balance} portfolio={portfolio}/>
      <Table
        className={styles.table}
        dataSource={dataSource} 
        columns={columns} 
        pagination={false} 
      />
    </div>
  )
}
