import { FC, useMemo, useState } from "react"
import { Switch } from "antd";
import { Doughnut } from 'react-chartjs-2';
import { useSelector } from "react-redux";

import { selectPortfolio, selectTotalBalance } from "store/slices/portfolio/selectors";
import { AssetClass } from "api/types";

import styles from './BalanceDonutChart.module.css'

const assetClassTitles: Record<AssetClass, string> = {
  cryptocurrency: 'Cryptocurrency',
  stocks: 'Stocks',
  cash: 'Cash',
}

export const BalanceDonutChart: FC = () => {
  const [isByClass, setIsByClass] = useState(false);
  const { data: portfolio } = useSelector(selectPortfolio);
  const totalBalance = useSelector(selectTotalBalance);

  const labels = useMemo<string[]>(() => {
    const labels = portfolio?.positions.map((position) => {
      return isByClass ? assetClassTitles[position.asset.class] : position.asset.name
    }, [])

    return Array.from(new Set(labels))
  }, [portfolio, isByClass])

  const data = useMemo<number[] | undefined>(() => {
    if(isByClass) {
      const priceByClass = new Map<AssetClass, number>(); 

      portfolio?.positions.forEach((position) => {
        const positionClass = position.asset.class;
        const currentClassPrice = priceByClass.get(positionClass);

        if(currentClassPrice) {
          priceByClass.set(positionClass, position.price + currentClassPrice)
        } else {
          priceByClass.set(positionClass, position.price)
        }
      })
      
      return Array.from(priceByClass.values())
    }

    return portfolio?.positions.map((position) => position.price)
  }, [portfolio, isByClass])
 
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.title}>Assets</h2>
        <div className={styles.sortClassSwitch}>
          <span>Group by asset class</span>
          <Switch value={isByClass} onChange={setIsByClass} />
        </div>
      </div>
      <hr />
      <div className={styles.donutContainer}>
        <Doughnut
          options={{
            plugins: {
              legend: {
                position: 'bottom',
              },
              tooltip: {
                callbacks: {
                  label: (label) => `${(Number(label.parsed) / totalBalance * 100).toFixed(2)} %`
                }
              }
            }
          }}
          data={{
            labels,
            datasets: [{
              data,
              backgroundColor: [
                '#914668',
                '#444c5c',
                '#668e46',
                '#ce5a57',
                '#78a5a3',
                '#e1b16a',
                '#46778e',
                '#ae7d78',
                '#784691',
              ],
            }],
          }}
        />
      </div>
    </div>
  )
}