import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Progress, 
  Divider, 
  Image, 
  Typography, 
  Radio, 
  Space,
  message,
  Row,
  Col,
  Statistic
} from 'antd';
import { CheckOutlined, BarChartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PollPage = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [pollData, setPollData] = useState({
    title: "Should we cancel the registration deadline?",
    description: "Let us know your preference.",
    status: "publish",
    options: [
      { label: "Yes", votes: 125, percentage: 45 },
      { label: "No", votes: 85, percentage: 30 },
      { label: "No Comment", votes: 40, percentage: 15 },
      { label: "Well known", votes: 30, percentage: 10 }
    ],
    totalVotes: 280,
    banner_image: {
      url: "https://d2ezooqjcs5g4c.cloudfront.net/upload/images/votine-1748167389550.jpg"
    }
  });

  const handleVote = () => {
    if (!selectedOption) {
      message.warning('Please select an option before voting');
      return;
    }
    
    // Here you would typically make an API call to submit the vote
    message.success(`Your vote for "${selectedOption}" has been recorded!`);
    setHasVoted(true);
    
    // Simulate updating the poll data (in a real app, this would come from the API)
    const updatedOptions = pollData.options.map(option => {
      if (option.label === selectedOption) {
        return { ...option, votes: option.votes + 1 };
      }
      return option;
    });
    
    const totalVotes = updatedOptions.reduce((sum, option) => sum + option.votes, 0);
    
    setPollData({
      ...pollData,
      options: updatedOptions.map(option => ({
        ...option,
        percentage: Math.round((option.votes / totalVotes) * 100)
      })),
      totalVotes: totalVotes
    });
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <Card
        cover={
          <Image
            src={pollData.banner_image.url}
            alt="Poll banner"
            preview={false}
            style={{ maxHeight: 300, objectFit: 'cover' }}
          />
        }
      >
        <Title level={3}>{pollData.title}</Title>
        <Text type="secondary">{pollData.description}</Text>
        
        <Divider />
        
        {!hasVoted ? (
          <>
            <Radio.Group 
              onChange={(e) => setSelectedOption(e.target.value)} 
              value={selectedOption}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {pollData.options.map((option) => (
                  <Radio key={option.label} value={option.label} style={{ padding: '8px 0' }}>
                    {option.label}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
            
            <Button 
              type="primary" 
              onClick={handleVote}
              icon={<CheckOutlined />}
              style={{ marginTop: 24, width: '100%' }}
              size="large"
            >
              Submit Vote
            </Button>
          </>
        ) : (
          <>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Statistic 
                  title="Total Votes" 
                  value={pollData.totalVotes} 
                  prefix={<BarChartOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="Your Vote" 
                  value={selectedOption ?? ''} 
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
            </Row>
            
            {pollData.options.map((option) => (
              <div key={option.label} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text strong>{option.label}</Text>
                  <Text>{option.percentage}% ({option.votes} votes)</Text>
                </div>
                <Progress 
                  percent={option.percentage} 
                  status={option.label === selectedOption ? 'active' : 'normal'}
                  strokeColor={option.label === selectedOption ? '#52c41a' : undefined}
                />
              </div>
            ))}
            
            <Button 
              type="dashed" 
              onClick={() => setHasVoted(false)}
              style={{ marginTop: 16, width: '100%' }}
            >
              Change My Vote
            </Button>
          </>
        )}
      </Card>
      
      <Divider />
      
      <Text type="secondary" style={{ display: 'block', textAlign: 'center' }}>
        Poll status: {pollData.status === 'publish' ? 'Published' : 'Draft'}
      </Text>
    </div>
  );
};

export default PollPage;