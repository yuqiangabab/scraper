import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Tag,
  Select,
  Popover,
  Button,
  Popconfirm,
  message
} from 'antd';
import cn from 'classnames';
import { get } from 'lodash';
import styles from './index.less';
import { readdirSync, remove } from 'fs-extra';

const { Option } = Select;

interface IProps {
  currentMediaInfo: any;
  selectable?: boolean;
  onSelect?: (keys: string[]) => void;
  tags?: string[];
  wpath?: string;
}
const MediaInfo = ({
  currentMediaInfo,
  selectable = false,
  onSelect = () => {},
  tags = [],
  wpath = ''
}: IProps) => {
  const selectedTags = get(currentMediaInfo, 'tag', []).map(tag => tag._text);
  const [delTips, setDelTips] = useState(<div></div>);
  const handleDelete = () => {
    remove(wpath)
      .then(() => message.success('删除成功'))
      .catch(err => message.error(err));
  };
  useEffect(() => {
    try {
      const files = readdirSync(wpath);

      setDelTips(
        <div>
          删除文件 $
          {files.map(file => (
            <div>{file}</div>
          ))}
        </div>
      );
    } catch (err) {}
  }, [wpath]);
  return (
    <Row>
      <div className={styles.media_info}>
        <div className={styles.media_title}>
          {get(currentMediaInfo, 'title._text')}
        </div>
        <Row>
          <Col span={8} offset={2}>
            <Popconfirm title={delTips} onConfirm={handleDelete}>
              <Button>删除</Button>
            </Popconfirm>
            <img
              style={{ maxWidth: '100%' }}
              src={get(currentMediaInfo, 'art.poster._text')}
              alt=''
            />
          </Col>
          <Col span={12} offset={2}>
            <div className={styles.info_item}>
              <div className={styles.info_label}>ID：</div>
              <div className={cn(styles.info_text, styles.uniqueid)}>
                {get(currentMediaInfo, 'uniqueid._text')}
              </div>
            </div>
            <div className={styles.info_item}>
              <div className={styles.info_label}>发行日期：</div>
              <div className={cn(styles.info_text)}>
                {get(currentMediaInfo, 'premiered._text')}
              </div>
            </div>
            <div className={styles.info_item}>
              <div className={styles.info_label}>类型：</div>
              <div className={cn(styles.info_text, styles.genre)}>
                {get(currentMediaInfo, 'genre', []).map(g => (
                  <Tag key={g._text}>{g._text}</Tag>
                ))}
              </div>
            </div>
            <div className={styles.info_item}>
              <div className={styles.info_label}>标签</div>
              <div className={cn(styles.info_text, styles.genre)}>
                {selectable ? (
                  <Select
                    mode='tags'
                    style={{ width: '100%' }}
                    placeholder='选择标签'
                    onChange={onSelect}
                    defaultValue={selectedTags}
                    value={selectedTags}
                  >
                    {tags.map(t => (
                      <Option key={t}>{t}</Option>
                    ))}
                  </Select>
                ) : (
                  selectedTags.map(g => <Tag key={g._text}>{g._text}</Tag>)
                )}
              </div>
            </div>
            <div className={styles.info_item}>
              <div className={styles.info_label}>演员：</div>
              <div className={cn(styles.info_text, styles.actor)}>
                {get(currentMediaInfo, 'actor', []).map(a => (
                  <figure key={a.name._text}>
                    <img src={a.thumb._text} alt='' />
                    <figcaption>{a.name._text}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </Col>
        </Row>
        {currentMediaInfo.thumbnails ? (
          <Row>
            <Col>
              <div className={styles.thumbnails}>
                {currentMediaInfo.thumbnails.map(url => (
                  <div key={url}>
                    <Popover
                      content={
                        <img alt='' src={url} style={{ maxWidth: 800 }} />
                      }
                    >
                      <img src={url} alt='' />
                    </Popover>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        ) : (
          ''
        )}
      </div>
    </Row>
  );
};
export default MediaInfo;
