<template>
  <div class="hello">

    <div>
      输入园所ID (默认南京实验幼儿园): <input v-model.trim="gid">
      <button @click="getAllData">确认</button>
    </div>

    <div>
      <el-select v-model="id" placeholder="请选择" @change="selectId(id)">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.classname"
          :value="item.id"
        />
      </el-select>
      <el-date-picker
        v-model="date"
        :clearable="false"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="selectTime(date)"
      />
      <button v-if="!tips.length" @click="search">查询</button>
      <span style="color: red; font-size: 18px">{{ tips }} </span>
    </div>

    <div v-loading="loading" style="display: flex;">

      <div>
        <h1>学生详细统计</h1>
        <table>
          <thead>
            <th>学生</th>
            <th>日期</th>
            <th>出勤</th>
            <th>测温</th>
            <th>睡眠</th>
            <th>运动</th>
            <th>区角</th>
            <th>报警</th>
            <th>电量</th>
          </thead>
          <tbody>
            <template v-for="(item, index) in tableData">
              <tr :key="index">
                <td :rowspan="item.List.length">{{ item.studentName }}</td>
                <td>{{ item.List[0].date }}</td>
                <td :class="{green: item.List[0].isAttendance, pink:!item.List[0].isAttendance }">{{ item.List[0].isAttendance ? '√' : 'X' }}</td>
                <td :class="{green: item.List[0].isTemp , pink:!item.List[0].isTemp }">{{ item.List[0].isTemp ? '√' : 'X' }}</td>
                <td :class="{green: item.List[0].isSleep, pink:!item.List[0].isSleep }">{{ item.List[0].isSleep ? '√' : 'X' }}</td>
                <td :class="{green: item.List[0].isSport, pink:!item.List[0].isSport }">{{ item.List[0].isSport ? '√' : 'X' }}</td>
                <td :class="{green: item.List[0].isAngle, pink:!item.List[0].isAngle }">{{ item.List[0].isAngle ? '√' : 'X' }}</td>
                <td :class="{green: item.List[0].isWarn, pink:!item.List[0].isWarn }">{{ item.List[0].isWarn ? '√' : 'X' }}</td>
                <td :class="{green: item.List[0].isBattery,pink:!item.List[0].isBattery }">{{ item.List[0].isBattery ? '√' : 'X' }}</td>
              </tr>
              <tr v-for="(ele,inx) in item.List.length-1" :key="index+'-'+inx">
                <td>{{ item.List[ele].date }}</td>
                <td :class="{green: item.List[ele].isAttendance, pink:!item.List[ele].isAttendance }">{{ item.List[ele].isAttendance ? '√' : 'X' }}</td>
                <td :class="{green: item.List[ele].isTemp, pink:!item.List[ele].isTemp }">{{ item.List[ele].isTemp ? '√' : 'X' }}</td>
                <td :class="{green: item.List[ele].isSleep, pink:!item.List[ele].isSleep }">{{ item.List[ele].isSleep ? '√' : 'X' }}</td>
                <td :class="{green: item.List[ele].isSport , pink:!item.List[ele].isSport }">{{ item.List[ele].isSport ? '√' : 'X' }}</td>
                <td :class="{green: item.List[ele].isAngle, pink:!item.List[ele].isAngle}">{{ item.List[ele].isAngle ? '√' : 'X' }}</td>
                <td :class="{green: item.List[ele].isWarn, pink:!item.List[ele].isWarn }">{{ item.List[ele].isWarn ? '√' : 'X' }}</td>
                <td :class="{green: item.List[ele].isBattery ,pink:!item.List[ele].isBattery }">{{ item.List[ele].isBattery ? '√' : 'X' }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div style="margin-left: 100px">
        <h1>班级统计结果 班级人数 {{ count }}</h1>
        <table>
          <thead>

            <th style="width:90px">日期</th>
            <th style="width:38px">出勤</th>
            <th style="width:38px">测温</th>
            <th style="width:38px">睡眠</th>
            <th style="width:38px">运动</th>
            <th style="width:38px">区角</th>
            <th style="width:38px">报警</th>
            <th style="width:38px">电量</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in classStatic" :key="index">
              <td>{{ item.date }}</td>
              <td>{{ item.attendance }}</td>
              <td>{{ item.temp }}</td>
              <td>{{ item.sleep }}</td>
              <td>{{ item.sport }}</td>
              <td>{{ item.angle }}</td>
              <td>{{ item.warn }}</td>
              <td>{{ item.battery }}</td>

            </tr>
          </tbody>
        </table>

        <h1>个人统计结果 统计天数 {{ days }}</h1>

        <table>
          <thead>

            <th style="width:90px">学生</th>
            <th style="width:38px">出勤</th>
            <th style="width:38px">测温</th>
            <th style="width:38px">睡眠</th>
            <th style="width:38px">运动</th>
            <th style="width:38px">区角</th>
            <th style="width:38px">报警</th>
            <th style="width:38px">电量</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in personStatic" :key="index">
              <td>{{ item.studentName }}</td>
              <td>{{ item.attendance }}</td>
              <td>{{ item.temp }}</td>
              <td>{{ item.sleep }}</td>
              <td>{{ item.sport }}</td>
              <td>{{ item.angle }}</td>
              <td>{{ item.warn }}</td>
              <td>{{ item.battery }}</td>

            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-left: 50px">
        <h1>信标数据</h1>

        <table>
          <thead>
            <th>区角名字</th>
            <th>Mac地址</th>
            <th>电量</th>
            <th>最后一次上传电量的时间</th>
          </thead>
          <tbody>
            <template v-for="(item,index) in beaconList">
              <tr :key="index">
                <td :rowspan="item.List.length">{{ item.name }}</td>
                <td :rowspan="item.List.length">{{ item.mac }}</td>
                <td>{{ item.List[0].battery }}</td>
                <td>{{ item.List[0].batteryTime }}</td>

              </tr>
              <tr v-for="(ele,inx) in item.List.length-1" :key="index+'-'+inx">
                <td>{{ item.List[ele].battery }}</td>
                <td>{{ item.List[ele].batteryTime }}</td>
              </tr>
            </template>

          </tbody>
        </table>

      </div>
    </div>

  </div>
</template>

<script>
import { getStudentList, getAttendanceList, getClassList, getTempList, getSleepList, getSportList, getAngleList, getWarnList, getBatteryList, getBeaconBatteryList } from '@/api/index'
import _ from 'lodash'
import dayjs from 'dayjs'
export default {
  name: 'HelloWorld',

  data() {
    return {
      id: '',
      gid: '',
      date: '',
      tips: '',
      days: 0,
      count: 0,
      loading: false,
      beaconList: [],
      classStatic: [],
      personStatic: [],
      options: [],
      dateList: [],
      tableData: []
    }
  },
  mounted() {
    this.getAllData()
  },
  methods: {
    async getAllData() {
      const classListRes = await getClassList({
        gid: this.gid || 6899,
        limit: 500
      })

      const { records } = classListRes

      this.options = records
    },
    selectId(id) {
      console.log(id, 'id')
    },
    selectTime(date) {
      const diffDays = dayjs(date[1]).diff(date[0], 'day')
      this.days = diffDays + 1
      const dateList = []
      for (let i = 0; i <= diffDays; i++) {
        dateList.push({
          date: dayjs(date[0]).add(i, 'day').format('YYYY-MM-DD')
        })
      }

      this.dateList = dateList
    },
    async search() {
      // 基础学生
      this.tips = '不要再次点击查询按钮,请耐心等待!'
      this.loading = true
      const classStudentsList = await getStudentList({
        gid: this.gid || 6899,
        classid: this.id
      })

      this.count = classStudentsList.length

      const classByTemp = classStudentsList.map(({ personid, mac }) => {
        return {
          personId: `${personid}`,
          mac
        }
      })

      const classByAngle = classStudentsList.map(({ personid }) => {
        return {
          personId: `${personid}`
        }
      })

      const classByWarn = classStudentsList.map(({ mac }) => {
        return {
          mac
        }
      })

      const classByBattery = classStudentsList.map(({ personid }) => {
        return {
          personId: `${personid}`
        }
      })

      // 考勤
      const attendanceListRes = []
      for (const date of this.dateList) {
        const res = await getAttendanceList({
          checkdate: date.date,
          gid: this.gid || 6899,
          classid: this.id
        })
        for (const item of res) {
          item.date = `${date.date}`
        }
        attendanceListRes.push(...res)
      }

      const groupByPerson = _.groupBy(attendanceListRes, 'personid')

      const attendanceStudentsList = Object.keys(groupByPerson).map((person) => {
        const personList = groupByPerson[person]

        return {
          personId: person,
          studentName: personList[0].name,
          List: personList.map(item => {
            return {
              date: item.date,
              isAttendance: item.attendancedate.length > 0
            }
          })
        }
      })

      // 测温
      const tempListRes = []

      for (const date of this.dateList) {
        const res = await getTempList({
          starttime: `${date.date} 07:00`,
          endtime: `${date.date} 16:30`,
          classid: this.id
        })
        for (const item of res) {
          item.date = `${date.date}`
        }
        tempListRes.push(...res)
      }

      const groupByMac = _.groupBy(tempListRes, 'mac')

      const TempStudentsList = Object.keys(groupByMac).map((mac) => {
        const macList = groupByMac[mac]
        return {
          mac,
          List: macList.map(item => {
            return item.date
          })
        }
      })

      for (const stu of classByTemp) {
        for (const temp of TempStudentsList) {
          if (stu.mac.toLowerCase() === temp.mac.toLowerCase()) {
            stu.List = temp.List
          }
        }
      }

      // 考勤 merge测温
      for (const student of attendanceStudentsList) {
        for (const temp of classByTemp) {
          if (student.personId === temp.personId) {
            student.mac = temp.mac
            for (const aDate of student.List) {
              if (temp.List) {
                if (temp.List.includes(aDate.date)) {
                  aDate.isTemp = true
                } else {
                  aDate.isTemp = false
                }
              } else {
                aDate.isTemp = false
              }
            }
          }
        }
      }

      // this.tableData = attendanceStudentsList

      // 睡眠
      const sleepListRes = []
      for (const date of this.dateList) {
        const res = await getSleepList({
          startTime: date.date,
          endTime: date.date,
          gid: this.gid || 6899,
          classid: this.id,
          isLast: 0
        })
        for (const item of res) {
          item.date = `${date.date}`
          item.personId = item.student.personid
        }
        sleepListRes.push(...res)
      }

      const groupByPersonIdForSleep = _.groupBy(sleepListRes, 'personId')

      const sleepStudentsList = Object.keys(groupByPersonIdForSleep).map((personId) => {
        const personList = groupByPersonIdForSleep[personId]
        return {
          personId,
          List: personList.map(item => {
            return {
              date: item.date,
              isSleep: item.bhyfXhbSleepPersonList.length > 0
            }
          })
        }
      })

      // 考勤 merge 测温 merge 睡眠

      for (const student of attendanceStudentsList) {
        for (const sleep of sleepStudentsList) {
          if (student.personId === sleep.personId) {
            for (const aDate of student.List) {
              for (const sDate of sleep.List) {
                if (aDate.date === sDate.date) {
                  aDate.isSleep = sDate.isSleep
                }
              }
            }
          }
        }
      }

      // 运动

      const sportListRes = []

      for (const date of this.dateList) {
        const res = await getSportList({
          startTime: date.date,
          endTime: date.date,
          gid: this.gid || 6899,
          classid: this.id,
          isLast: 0
        })
        for (const item of res) {
          item.date = `${date.date}`
          item.personId = item.student.personid
        }
        sportListRes.push(...res)
      }

      const groupByPersonIdForSport = _.groupBy(sportListRes, 'personId')

      const sportStudentsList = Object.keys(groupByPersonIdForSport).map((personId) => {
        const personList = groupByPersonIdForSport[personId]
        return {
          personId,
          List: personList.map(item => {
            return {
              date: item.date,
              isSport: item.sportPersonList.length > 0
            }
          })
        }
      })

      // 考勤 merge 测温 merge 睡眠 merge 运动

      for (const student of attendanceStudentsList) {
        for (const sport of sportStudentsList) {
          if (student.personId === sport.personId) {
            for (const aDate of student.List) {
              for (const sDate of sport.List) {
                if (aDate.date === sDate.date) {
                  aDate.isSport = sDate.isSport
                }
              }
            }
          }
        }
      }

      // 区角

      const angleListRes = []

      for (const date of this.dateList) {
        const res = await getAngleList({
          startTime: `${date.date} 00:00:00`,
          endTime: `${date.date} 23:59:59`,
          classid: this.id
        })
        for (const item of res) {
          item.date = `${date.date}`
        }
        angleListRes.push(...res)
      }

      const groupByPersonForAngle = _.groupBy(angleListRes, 'personid')

      const angleStudentsList = Object.keys(groupByPersonForAngle).map((person) => {
        const personList = groupByPersonForAngle[person]

        const groupByDate = _.groupBy(personList, 'date')

        const List = Object.keys(groupByDate).map((date) => {
          return {
            date,
            isAngle: true
          }
        })

        return {
          personId: person,
          List: List.map(({ date }) => date)
        }
      })

      // classByAngle
      for (const stu of classByAngle) {
        for (const temp of angleStudentsList) {
          if (stu.personId === temp.personId) {
            stu.List = temp.List
          }
        }
      }

      // 考勤 merge 测温 merge 睡眠 merge 运动 merge 区角
      for (const student of attendanceStudentsList) {
        for (const angle of classByAngle) {
          if (student.personId === angle.personId) {
            // student.mac = temp.mac
            for (const aDate of student.List) {
              if (angle.List) {
                if (angle.List.includes(aDate.date)) {
                  aDate.isAngle = true
                } else {
                  aDate.isAngle = false
                }
              } else {
                aDate.isAngle = false
              }
            }
          }
        }
      }

      // 警报
      const warnListRes = []

      for (const date of this.dateList) {
        const res = await getWarnList({
          starttime: `${date.date} 07:00:00`,
          endtime: `${date.date} 18:00:00`,
          classid: this.id
        })
        for (const item of res) {
          item.date = `${date.date}`
        }
        warnListRes.push(...res)
      }

      const groupByMacForWarn = _.groupBy(warnListRes, 'mac')

      const warnStudentList = Object.keys(groupByMacForWarn).map((mac) => {
        const groupByDate = _.groupBy(groupByMacForWarn[mac], 'date')

        const List = Object.keys(groupByDate).map((date) => {
          // const dateList = groupByDate[date].sort((a, b) => {
          //   return new Date(a.checktime).getTime() - new Date(b.checktime).getTime()
          // })

          return date
        })
        return {
          mac,
          List
        }
      })

      // classByWarn
      for (const stu of classByWarn) {
        for (const temp of warnStudentList) {
          if (stu.mac.toLowerCase() === temp.mac.toLowerCase()) {
            stu.List = temp.List
          }
        }
      }

      // 考勤 merge 测温 merge 睡眠 merge 运动 merge 区角 merge 报警
      for (const student of attendanceStudentsList) {
        for (const warn of classByWarn) {
          if (student.mac.toLowerCase() === warn.mac.toLowerCase()) {
            // student.mac = temp.mac
            for (const aDate of student.List) {
              if (warn.List) {
                if (warn.List.includes(aDate.date)) {
                  aDate.isWarn = true
                } else {
                  aDate.isWarn = false
                }
              } else {
                aDate.isWarn = false
              }
            }
          }
        }
      }

      // 手环电量

      const batteryRes = []

      for (const date of this.dateList) {
        const res = await getBatteryList({
          starttime: `${date.date} 00:00:00`,
          endtime: `${date.date} 23:59:59`,
          classid: this.id,
          gid: this.gid || 6899
        })
        for (const item of res) {
          item.date = `${date.date}`
        }
        batteryRes.push(...res)
      }

      const groupByPersonForBatterry = _.groupBy(batteryRes, 'personid')

      const batteryStudentsList = Object.keys(groupByPersonForBatterry).map((person) => {
        const personList = groupByPersonForBatterry[person]
        return {
          personId: person,
          List: [... new Set(personList.map(({ date }) => date))]
        }
      })

      // classByWarn
      for (const stu of classByBattery) {
        for (const battery of batteryStudentsList) {
          if (stu.personId === battery.personId) {
            stu.List = battery.List
          }
        }
      }

      // 考勤 merge 测温 merge 睡眠 merge 运动 merge 区角 merge 报警 merge 电量
      for (const student of attendanceStudentsList) {
        for (const battery of classByBattery) {
          if (student.personId === battery.personId) {
            for (const aDate of student.List) {
              if (battery.List) {
                if (battery.List.includes(aDate.date)) {
                  aDate.isBattery = true
                } else {
                  aDate.isBattery = false
                }
              } else {
                aDate.isBattery = false
              }
            }
          }
        }
      }

      // 信标电量
      const beaconBatteryRes = []

      for (const date of this.dateList) {
        const res = await getBeaconBatteryList({
          starttime: `${date.date} 00:00:00`,
          endtime: `${date.date} 23:59:59`,
          classid: this.id,
          gid: this.gid || 6899
        })
        for (const item of res) {
          item.date = `${date.date}`
        }
        beaconBatteryRes.push(...res)
      }

      const groupByMacForBeacon = _.groupBy(beaconBatteryRes, 'mac')

      const beaconList = Object.keys(groupByMacForBeacon).map((mac) => {
        const groupByDateForBeacon = _.groupBy(groupByMacForBeacon[mac], 'date')

        const List = Object.keys(groupByDateForBeacon).map((date) => {
          const last = _.last(groupByDateForBeacon[date].sort((a, b) => new Date(a.batterytime).getTime() - new Date(b.batterytime).getTime()))
          return {
            date,
            battery: last.battery,
            batteryTime: last.batterytime
          }
        })
        return {
          mac,
          name: groupByMacForBeacon[mac][0].anglename,
          List
        }
      })

      this.beaconList = beaconList
      // 班级统计结果

      const allStudentsTypeList = attendanceStudentsList.reduce((acc, cur) => {
        acc.push(...cur.List)
        return acc
      }, [])

      const groupByDateForAllStudentsTypeList = _.groupBy(allStudentsTypeList, 'date')

      const classStatic = Object.keys(groupByDateForAllStudentsTypeList).map((date) => {
        const studentsTypeList = groupByDateForAllStudentsTypeList[date]
        return {
          date,
          attendance: studentsTypeList.filter(({ isAttendance }) => isAttendance).length,
          battery: studentsTypeList.filter(({ isBattery }) => isBattery).length,
          sleep: studentsTypeList.filter(({ isSleep }) => isSleep).length,
          sport: studentsTypeList.filter(({ isSport }) => isSport).length,
          temp: studentsTypeList.filter(({ isTemp }) => isTemp).length,
          warn: studentsTypeList.filter(({ isWarn }) => isWarn).length,
          angle: studentsTypeList.filter(({ isAngle }) => isAngle).length
        }
      })

      // 个人统计结果

      const personStatic = attendanceStudentsList.map((item) => {
        return {
          studentName: item.studentName,
          attendance: item.List.filter(({ isAttendance }) => isAttendance).length,
          battery: item.List.filter(({ isBattery }) => isBattery).length,
          sleep: item.List.filter(({ isSleep }) => isSleep).length,
          sport: item.List.filter(({ isSport }) => isSport).length,
          temp: item.List.filter(({ isTemp }) => isTemp).length,
          warn: item.List.filter(({ isWarn }) => isWarn).length,
          angle: item.List.filter(({ isAngle }) => isAngle).length
        }
      })

      this.tableData = attendanceStudentsList

      this.classStatic = classStatic

      this.personStatic = personStatic

      this.tips = ''
      this.loading = false
      console.log(personStatic, 'attendanceListRes')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.green {
  background-color: #1ed760;
}
.pink {
    background-color: red;
}
table {
  /* width: 300px; */
  border: 1px solid #ccc;
  border-collapse: collapse;
}
thead th{
    text-align: left;
    background-color: #fafafa;
}
th,td {
  padding-left: 20px;
  border: 1px solid #e9eaec;
  line-height: 30px;
}
</style>
