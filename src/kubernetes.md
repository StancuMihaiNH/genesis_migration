

Setup AWS IAM

asw configure


eksctl create cluster \
--name genesis-test-v1 \
--version 1.29 \
--region us-east-1 \
--nodegroup-name standard-workers \
--node-type t3.medium \
--nodes 3 \
--nodes-min 1 \
--nodes-max 4 \
--managed \
--with-oidc




eksctl create cluster \
--name genesis-test-v1 \
--version 1.29 \
--region us-east-1 \
--nodegroup-name standard-workers \
--node-type t3.medium \
--nodes 3 \
--nodes-min 1 \
--nodes-max 4 \
--managed \
--with-oidc \
--asg-access \
--external-dns-access \
--full-ecr-access \
--appmesh-access \
--alb-ingress-access \
--node-role arn:aws:iam::533267357181:role/eks-node-role \
--role arn:aws:iam::533267357181:role/EKSCluster


