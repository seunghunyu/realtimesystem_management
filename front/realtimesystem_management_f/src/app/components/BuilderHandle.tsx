import { Handle, useNodeConnections, HandleProps } from '@xyflow/react';

interface BuilderHandleProps extends HandleProps {
  connectionLimit?: number;
  connectionCount?: number;
}

const BuilderHandle = (props: BuilderHandleProps) => {
  // 💡 connectionCount와 connectionLimit을 둘 다 지원하도록 가공
  const { connectionCount, connectionLimit, ...restProps } = props;

  const connections = useNodeConnections({
    handleType: props.type,
  });

  // 넘겨받은 제한 수가 있다면 그 값을, 없으면 Infinity 사용
  const limit = connectionCount ?? connectionLimit ?? Infinity;

  return (
    <Handle 
      {...restProps} 
      isConnectable={connections.length < limit} 
    />
  );
};

export default BuilderHandle;